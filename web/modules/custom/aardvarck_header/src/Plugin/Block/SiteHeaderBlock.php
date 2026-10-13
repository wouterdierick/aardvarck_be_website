<?php

declare(strict_types=1);

namespace Drupal\aardvarck_header\Plugin\Block;

use Drupal\Core\Block\Attribute\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
use Drupal\Core\StringTranslation\TranslatableMarkup;

#[Block(
  id: 'aardvarck_site_header',
  admin_label: new TranslatableMarkup('Site header'),
  category: new TranslatableMarkup('Aardvarck'),
)]
final class SiteHeaderBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    return [
      '#markup' => '',
      '#cache' => [
        'contexts' => $this->getCacheContexts(),
        'tags' => $this->getCacheTags(),
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheContexts(): array {
    return Cache::mergeContexts(parent::getCacheContexts(), [
      'route',
      'languages:language_interface',
      'user.roles:is_authenticated',
    ]);
  }

}
