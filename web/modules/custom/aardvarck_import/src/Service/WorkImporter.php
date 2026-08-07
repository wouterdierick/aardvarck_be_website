<?php

namespace Drupal\aardvarck_import\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\file\FileInterface;
use Drupal\media\Entity\Media;
use Drupal\node\NodeInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Yaml\Yaml;

/**
 * Scans an extracted import package and creates/updates "work" nodes.
 */
class WorkImporter {

  /**
   * Filenames that are metadata, not work packages, and must be ignored
   * wherever they appear in an uploaded zip.
   */
  protected const IGNORED_FILENAMES = ['structure.yml', 'mapping.yml', 'agent_info.md'];

  protected const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

  protected const REQUIRED_YAML_KEYS = [
    'id', 'name', 'date', 'work_width', 'work_height', 'work_medium',
    'work_technique', 'academy_name', 'academy_year', 'academy_program',
    'academy_study_year', 'academy_teacher',
  ];

  public function __construct(
    protected EntityTypeManagerInterface $entityTypeManager,
    protected TermResolver $termResolver,
    protected ImageResizer $imageResizer,
    protected FileSystemInterface $fileSystem,
    protected LoggerInterface $logger,
  ) {}

  /**
   * Recursively scans an extracted directory and groups files by work id.
   *
   * @param string $directory
   *   Absolute path to the extracted zip contents.
   *
   * @return array
   *   An array with:
   *   - 'groups': array keyed by work id, each an array with 'yml' (path)
   *     and 'images' (array of paths, in suffix order).
   *   - 'errors': array of ['id' => string, 'message' => string] for
   *     groups that failed structural validation (missing yml, no images).
   */
  public function scanDirectory(string $directory): array {
    $ymlFiles = [];
    $imageFiles = [];

    $iterator = new \RecursiveIteratorIterator(
      new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS)
    );
    foreach ($iterator as $fileInfo) {
      /** @var \SplFileInfo $fileInfo */
      $filename = $fileInfo->getFilename();
      if (in_array(strtolower($filename), self::IGNORED_FILENAMES, TRUE)) {
        continue;
      }
      $extension = strtolower($fileInfo->getExtension());
      $basename = $fileInfo->getBasename('.' . $fileInfo->getExtension());

      if ($extension === 'yml') {
        $ymlFiles[$basename] = $fileInfo->getPathname();
      }
      elseif (in_array($extension, self::IMAGE_EXTENSIONS, TRUE)) {
        $imageFiles[] = ['basename' => $basename, 'path' => $fileInfo->getPathname()];
      }
    }

    // Work ids may themselves contain "_<digits>" (e.g. "WDABKMO_007"), so a
    // plain "strip trailing _N" regex can't reliably tell an id from an
    // id+suffix. Known yml basenames are the authoritative ids: match each
    // image against them (longest id first) before falling back to a naive
    // heuristic for orphan images (which will end up reported as an error
    // anyway, since there's no yml to pair them with).
    $knownIds = array_keys($ymlFiles);
    usort($knownIds, fn($a, $b) => strlen($b) <=> strlen($a));

    $raw = [];
    foreach ($ymlFiles as $id => $path) {
      $raw[$id]['yml'] = $path;
    }

    foreach ($imageFiles as $image) {
      $basename = $image['basename'];
      $id = NULL;
      $order = 0;

      if (in_array($basename, $knownIds, TRUE)) {
        // Exact match: single, unsuffixed image for a known work.
        $id = $basename;
        $order = 0;
      }
      else {
        foreach ($knownIds as $candidateId) {
          if (preg_match('/^' . preg_quote($candidateId, '/') . '_(\d+)$/', $basename, $matches)) {
            $id = $candidateId;
            $order = (int) $matches[1];
            break;
          }
        }
      }

      if ($id === NULL) {
        // No known yml id matches: fall back to a best-effort split so the
        // image still ends up in *some* group (reported as an error below,
        // since it will have no matching yml).
        if (preg_match('/^(.+)_(\d+)$/', $basename, $matches)) {
          $id = $matches[1];
          $order = (int) $matches[2];
        }
        else {
          $id = $basename;
          $order = 0;
        }
      }

      $raw[$id]['images'][$order] = $image['path'];
    }

    $groups = [];
    $errors = [];
    foreach ($raw as $id => $data) {
      if (empty($data['yml'])) {
        $errors[] = ['id' => $id, 'message' => 'No matching .yml file found for this image group.'];
        continue;
      }
      if (empty($data['images'])) {
        $errors[] = ['id' => $id, 'message' => 'No image files found for this work.'];
        continue;
      }
      ksort($data['images']);
      $groups[$id] = [
        'id' => $id,
        'yml' => $data['yml'],
        'images' => array_values($data['images']),
      ];
    }

    return ['groups' => $groups, 'errors' => $errors];
  }

  /**
   * Imports (creates or updates) a single work from a scanned group.
   *
   * @param array $group
   *   A group as returned by scanDirectory(): ['id', 'yml', 'images'].
   * @param bool $overwrite
   *   Whether to update an existing work with the same field_id, or skip
   *   it.
   *
   * @return array
   *   Result info: ['id', 'status' => created|updated|skipped|error,
   *   'message', 'warnings' => string[]].
   */
  public function importWorkGroup(array $group, bool $overwrite): array {
    $id = $group['id'];

    try {
      $data = Yaml::parseFile($group['yml']);
    }
    catch (\Throwable $e) {
      return $this->result($id, 'error', 'Could not parse YAML: ' . $e->getMessage());
    }

    if (!is_array($data)) {
      return $this->result($id, 'error', 'YAML file is empty or invalid.');
    }

    $missing = array_filter(self::REQUIRED_YAML_KEYS, fn($key) => !array_key_exists($key, $data));
    if ($missing) {
      return $this->result($id, 'error', 'Missing required YAML keys: ' . implode(', ', $missing));
    }

    if ((string) ($data['id'] ?? '') !== (string) $id) {
      return $this->result($id, 'error', sprintf('YAML "id" (%s) does not match filename (%s).', $data['id'] ?? '(none)', $id));
    }

    $nodeStorage = $this->entityTypeManager->getStorage('node');
    $existing = $nodeStorage->loadByProperties(['type' => 'work', 'field_id' => $id]);
    $existingNode = $existing ? reset($existing) : NULL;

    if ($existingNode && !$overwrite) {
      return $this->result($id, 'skipped', 'Existing work, overwrite not enabled.');
    }

    $warnings = [];

    try {
      $year = $this->extractYear($data['date']);
      $month = $this->extractMonth($data['date']);
      $nameNl = $data['name']['nl'] ?? '';
      $nameEn = $data['name']['en'] ?? '';
      $descriptionNl = $data['description']['nl'] ?? '';
      $descriptionEn = $data['description']['en'] ?? '';

      $termFields = [
        'field_work_medium' => $data['work_medium'],
        'field_work_technique' => $data['work_technique'],
        'field_academy_name' => $data['academy_name'],
        'field_academic_year' => $data['academy_year'],
        'field_academy_program' => $data['academy_program'],
        'field_academy_study_year' => $data['academy_study_year'],
        'field_academy_teacher' => $data['academy_teacher'],
      ];
      $resolvedTerms = [];
      foreach ($termFields as $fieldName => $rawValue) {
        $resolved = $this->termResolver->resolve($fieldName, $rawValue);
        $resolvedTerms[$fieldName] = $resolved['tids'];
        foreach ($resolved['unmapped'] as $unmappedValue) {
          $warnings[] = sprintf('Term "%s" for %s is not in mapping.yml — created as-is, needs manual review.', $unmappedValue, $fieldName);
        }
      }

      $mediaIds = $this->processImages($group['images'], $id, $year, $nameNl, $existingNode);

      $isNew = !$existingNode;
      $node = $existingNode ?? $nodeStorage->create([
        'type' => 'work',
        'langcode' => 'nl',
        'status' => 0,
        'field_id' => $id,
      ]);

      $node->setUnpublished();
      $node->set('title', $nameNl);
      $node->set('field_description', ['value' => $descriptionNl, 'format' => 'restricted_html']);
      $node->set('field_date', ['value' => sprintf('%04d-%02d-01', $year, $month)]);
      $node->set('field_work_width', $data['work_width']);
      $node->set('field_work_height', $data['work_height']);
      foreach ($resolvedTerms as $fieldName => $tids) {
        $node->set($fieldName, array_map(fn($tid) => ['target_id' => $tid], $tids));
      }
      $node->set('field_teaser_images', array_map(fn($mid) => ['target_id' => $mid], $mediaIds));
      $node->save();

      if ($node->hasTranslation('en')) {
        $translation = $node->getTranslation('en');
      }
      else {
        $translation = $node->addTranslation('en');
      }
      $translation->setTitle($nameEn);
      $translation->set('field_description', ['value' => $descriptionEn, 'format' => 'restricted_html']);
      $node->save();

      $status = $isNew ? 'created' : 'updated';
      return $this->result($id, $status, $isNew ? 'Work created.' : 'Work updated, teaser images replaced.', $warnings);
    }
    catch (\Throwable $e) {
      $this->logger->error('Import failed for @id: @message', ['@id' => $id, '@message' => $e->getMessage()]);
      return $this->result($id, 'error', $e->getMessage());
    }
  }

  /**
   * Resizes and saves the work's images as image media entities.
   *
   * If updating an existing work, its previous teaser media (and
   * underlying files) are deleted first, so images are fully replaced.
   *
   * @return int[]
   *   The new media entity IDs, in image order.
   */
  protected function processImages(array $imagePaths, string $id, int $year, string $titleNl, ?NodeInterface $existingNode): array {
    if ($existingNode) {
      $this->deleteExistingTeaserMedia($existingNode);
    }

    $destinationDirectory = sprintf('public://work/%d/%s', $year, $id);
    $mediaIds = [];
    foreach ($imagePaths as $index => $sourcePath) {
      $suffix = $index === 0 ? '' : '_' . $index;
      $extension = strtolower(pathinfo($sourcePath, PATHINFO_EXTENSION));
      $filename = $id . $suffix . '.' . $extension;

      $file = $this->imageResizer->resizeAndSave($sourcePath, $destinationDirectory, $filename);
      $alt = $index === 0 ? $titleNl : sprintf('%s — afbeelding %d', $titleNl, $index + 1);

      $media = Media::create([
        'bundle' => 'image',
        'name' => $id . $suffix,
        'status' => 1,
        'field_media_image' => [
          'target_id' => $file->id(),
          'alt' => $alt,
        ],
      ]);
      $media->save();
      $mediaIds[] = (int) $media->id();
    }

    return $mediaIds;
  }

  /**
   * Deletes the media entities currently referenced by a work's teaser
   * images field (and their underlying files), ahead of a full replace.
   */
  protected function deleteExistingTeaserMedia(NodeInterface $node): void {
    $mediaStorage = $this->entityTypeManager->getStorage('media');
    $mediaItems = $node->get('field_teaser_images')->referencedEntities();
    foreach ($mediaItems as $media) {
      if ($media->hasField('field_media_image') && !$media->get('field_media_image')->isEmpty()) {
        $file = $media->get('field_media_image')->entity;
        if ($file instanceof FileInterface) {
          $file->delete();
        }
      }
    }
    if ($mediaItems) {
      $mediaStorage->delete($mediaItems);
    }
  }

  /**
   * Extracts the year (int) from a "MM-YYYY" date string.
   */
  protected function extractYear(string $date): int {
    $parts = explode('-', $date);
    return (int) ($parts[1] ?? date('Y'));
  }

  /**
   * Extracts the month (int) from a "MM-YYYY" date string.
   */
  protected function extractMonth(string $date): int {
    $parts = explode('-', $date);
    return (int) ($parts[0] ?? 1);
  }

  /**
   * Builds a standard result array.
   */
  protected function result(string $id, string $status, string $message, array $warnings = []): array {
    return [
      'id' => $id,
      'status' => $status,
      'message' => $message,
      'warnings' => $warnings,
    ];
  }

}
