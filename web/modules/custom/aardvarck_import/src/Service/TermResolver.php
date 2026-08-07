<?php

namespace Drupal\aardvarck_import\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\taxonomy\Entity\Term;
use Psr\Log\LoggerInterface;
use Symfony\Component\Yaml\Yaml;

/**
 * Resolves raw YAML values to taxonomy terms using data/mapping.yml.
 *
 * See the module README.md for the full mapping algorithm. In short:
 * - Translatable vocabularies (work_medium, work_technique,
 *   academy_program) are mapped from an English raw value to a Dutch
 *   canonical term name + English translation, via an nl/en pair list in
 *   mapping.yml.
 * - Non-translatable vocabularies (academy_name, academy_year,
 *   academy_study_year, academy_teacher) use the raw value verbatim as the
 *   term name, matched against a flat list in mapping.yml purely to detect
 *   possible typos (does not block import either way).
 */
class TermResolver {

  /**
   * Field name => [vocabulary id, translatable, mapping.yml key].
   */
  protected const FIELD_MAP = [
    'field_work_medium' => ['vocabulary' => 'work_medium', 'translatable' => TRUE, 'mapping_key' => 'work_medium'],
    'field_work_technique' => ['vocabulary' => 'work_technique', 'translatable' => TRUE, 'mapping_key' => 'work_technique'],
    'field_academy_program' => ['vocabulary' => 'academy_program', 'translatable' => TRUE, 'mapping_key' => 'academy_program'],
    'field_academy_name' => ['vocabulary' => 'academy_name', 'translatable' => FALSE, 'mapping_key' => 'academy_name'],
    'field_academic_year' => ['vocabulary' => 'academy_year', 'translatable' => FALSE, 'mapping_key' => 'academy_year'],
    'field_academy_study_year' => ['vocabulary' => 'academy_study_year', 'translatable' => FALSE, 'mapping_key' => 'academy_study_year'],
    'field_academy_teacher' => ['vocabulary' => 'academy_teacher', 'translatable' => FALSE, 'mapping_key' => 'academy_teacher'],
  ];

  /**
   * Parsed contents of data/mapping.yml, lazily loaded.
   *
   * @var array|null
   */
  protected ?array $mapping = NULL;

  /**
   * Cache of already-loaded terms, keyed by "vocabulary:name".
   *
   * @var \Drupal\taxonomy\TermInterface[]
   */
  protected array $termCache = [];

  public function __construct(
    protected EntityTypeManagerInterface $entityTypeManager,
    protected LanguageManagerInterface $languageManager,
    protected ModuleHandlerInterface $moduleHandler,
    protected LoggerInterface $logger,
  ) {}

  /**
   * Returns the list of node field names this resolver knows how to handle.
   *
   * @return string[]
   */
  public function getTaxonomyFieldNames(): array {
    return array_keys(self::FIELD_MAP);
  }

  /**
   * Resolves one or more raw YAML values for a given work field.
   *
   * @param string $fieldName
   *   One of the field names in self::FIELD_MAP.
   * @param string|string[] $rawValues
   *   A single raw value, or an array of raw values (for multi-value
   *   fields like field_work_technique or field_academy_teacher).
   *
   * @return array
   *   An array with:
   *   - 'tids': array of resolved term IDs, in input order.
   *   - 'unmapped': array of raw values that were not found in mapping.yml
   *     (for reporting purposes only, import is never blocked by this).
   */
  public function resolve(string $fieldName, string|array $rawValues): array {
    if (!isset(self::FIELD_MAP[$fieldName])) {
      throw new \InvalidArgumentException("Unknown taxonomy field: $fieldName");
    }
    $config = self::FIELD_MAP[$fieldName];
    $values = is_array($rawValues) ? $rawValues : [$rawValues];

    $tids = [];
    $unmapped = [];
    foreach ($values as $rawValue) {
      $rawValue = trim((string) $rawValue);
      if ($rawValue === '') {
        continue;
      }
      if ($config['translatable']) {
        [$tid, $wasMapped] = $this->resolveTranslatable($config['vocabulary'], $config['mapping_key'], $rawValue);
      }
      else {
        [$tid, $wasMapped] = $this->resolveFlat($config['vocabulary'], $config['mapping_key'], $rawValue);
      }
      $tids[] = $tid;
      if (!$wasMapped) {
        $unmapped[] = $rawValue;
      }
    }

    return ['tids' => $tids, 'unmapped' => $unmapped];
  }

  /**
   * Resolves a value against a translatable (nl/en) mapping section.
   *
   * @return array{0: int, 1: bool}
   *   The resolved term ID, and whether the value was found in mapping.yml.
   */
  protected function resolveTranslatable(string $vocabulary, string $mappingKey, string $rawValueEn): array {
    $entry = NULL;
    foreach ($this->getMappingSection($mappingKey) as $candidate) {
      if (isset($candidate['en']) && $candidate['en'] === $rawValueEn) {
        $entry = $candidate;
        break;
      }
    }

    if ($entry !== NULL) {
      $enName = $entry['en'];
      $nlName = $entry['nl'];
      $term = $this->findTermByName($vocabulary, $enName, 'en') ?? $this->findTermByName($vocabulary, $enName, NULL);
      if ($term) {
        if (!$term->hasTranslation('nl')) {
          $term->addTranslation('nl', ['name' => $nlName]);
          $term->save();
        }
        return [(int) $term->id(), TRUE];
      }
      $term = Term::create([
        'vid' => $vocabulary,
        'name' => $enName,
        'langcode' => 'en',
      ]);
      $term->save();
      $term->addTranslation('nl', ['name' => $nlName]);
      $term->save();
      return [(int) $term->id(), TRUE];
    }

    // Unmapped: no Dutch name known, create directly in English.
    $term = $this->findTermByName($vocabulary, $rawValueEn, 'en') ?? $this->findTermByName($vocabulary, $rawValueEn, NULL);
    if ($term) {
      return [(int) $term->id(), FALSE];
    }
    $term = Term::create([
      'vid' => $vocabulary,
      'name' => $rawValueEn,
      'langcode' => 'en',
    ]);
    $term->save();
    $this->logger->warning('Created unmapped @vocab term "@name" (not in mapping.yml).', [
      '@vocab' => $vocabulary,
      '@name' => $rawValueEn,
    ]);
    return [(int) $term->id(), FALSE];
  }

  /**
   * Resolves a value against a flat (non-translatable) mapping section.
   *
   * @return array{0: int, 1: bool}
   *   The resolved term ID, and whether the value was found in mapping.yml.
   */
  protected function resolveFlat(string $vocabulary, string $mappingKey, string $rawValue): array {
    $wasMapped = in_array($rawValue, $this->getMappingSection($mappingKey), TRUE);

    $term = $this->findTermByName($vocabulary, $rawValue, NULL);
    if ($term) {
      return [(int) $term->id(), $wasMapped];
    }
    $term = Term::create([
      'vid' => $vocabulary,
      'name' => $rawValue,
    ]);
    $term->save();
    if (!$wasMapped) {
      $this->logger->warning('Created @vocab term "@name" that is not listed in mapping.yml — possible typo, please review.', [
        '@vocab' => $vocabulary,
        '@name' => $rawValue,
      ]);
    }
    return [(int) $term->id(), $wasMapped];
  }

  /**
   * Finds an existing term by name within a vocabulary.
   *
   * @param string $vocabulary
   *   The vocabulary machine name.
   * @param string $name
   *   The term name to match.
   * @param string|null $langcode
   *   If given, match the term's name in this translation specifically.
   *   If NULL, match the entity's default (untranslated) name.
   *
   * @return \Drupal\taxonomy\TermInterface|null
   *   The matching term, or NULL.
   */
  protected function findTermByName(string $vocabulary, string $name, ?string $langcode): ?\Drupal\taxonomy\TermInterface {
    $cacheKey = $vocabulary . ':' . ($langcode ?? '_default') . ':' . $name;
    if (isset($this->termCache[$cacheKey])) {
      return $this->termCache[$cacheKey];
    }

    $storage = $this->entityTypeManager->getStorage('taxonomy_term');
    $terms = $storage->loadByProperties(['vid' => $vocabulary]);
    foreach ($terms as $term) {
      if ($langcode !== NULL) {
        if ($term->hasTranslation($langcode) && $term->getTranslation($langcode)->label() === $name) {
          $this->termCache[$cacheKey] = $term;
          return $term;
        }
      }
      elseif ($term->label() === $name) {
        $this->termCache[$cacheKey] = $term;
        return $term;
      }
    }
    return NULL;
  }

  /**
   * Returns one section of the parsed mapping.yml file.
   */
  protected function getMappingSection(string $key): array {
    $mapping = $this->getMapping();
    return $mapping[$key] ?? [];
  }

  /**
   * Loads and parses data/mapping.yml, caching the result.
   */
  protected function getMapping(): array {
    if ($this->mapping === NULL) {
      $path = $this->moduleHandler->getModule('aardvarck_import')->getPath() . '/data/mapping.yml';
      $this->mapping = file_exists($path) ? (Yaml::parseFile($path) ?? []) : [];
    }
    return $this->mapping;
  }

}
