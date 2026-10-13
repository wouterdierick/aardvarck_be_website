<?php

declare(strict_types=1);

namespace Drupal\aardvarck_header\Plugin\Block;

use Drupal\aardvarck_header\HeaderViewModelBuilder;
use Drupal\Core\Block\Attribute\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Symfony\Component\DependencyInjection\ContainerInterface;

#[Block(
  id: 'aardvarck_site_header',
  admin_label: new TranslatableMarkup('Site header'),
  category: new TranslatableMarkup('Aardvarck'),
)]
final class SiteHeaderBlock extends BlockBase implements ContainerFactoryPluginInterface {

  use StringTranslationTrait;

  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    private readonly HeaderViewModelBuilder $viewModelBuilder,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): self {
    return new self(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('aardvarck_header.view_model_builder'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $viewModel = $this->viewModelBuilder->build();

    return [
      '#type' => 'component',
      '#component' => 'aardvarck:site-header',
      '#props' => $viewModel,
      '#cache' => [
        'contexts' => $this->getCacheContexts(),
        'tags' => $this->getCacheTags(),
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheTags(): array {
    return Cache::mergeTags(parent::getCacheTags(), [
      'config:system.site',
      'config:system.menu.main',
      'config:configurable_language_list',
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheContexts(): array {
    return Cache::mergeContexts(parent::getCacheContexts(), [
      'route',
      'languages:language_interface',
      'user',
    ]);
  }

}
