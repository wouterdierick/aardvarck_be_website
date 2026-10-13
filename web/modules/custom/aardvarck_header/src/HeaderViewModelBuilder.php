<?php

declare(strict_types=1);

namespace Drupal\aardvarck_header;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Menu\MenuLinkTreeElement;
use Drupal\Core\Menu\MenuLinkTreeInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Url;

final class HeaderViewModelBuilder {

  use StringTranslationTrait;

  public function __construct(
    private readonly ConfigFactoryInterface $configFactory,
    private readonly MenuLinkTreeInterface $menuLinkTree,
    private readonly AccountProxyInterface $currentUser,
    private readonly LanguageManagerInterface $languageManager,
  ) {
  }

  public function build(): array {
    $mainNavigationLinks = $this->buildMainNavigationLinks();
    $languageLinks = $this->buildLanguageLinks();
    $userLinks = $this->buildUserLinks();
    $cartSummary = $this->buildCartSummary();
    $siteConfig = $this->configFactory->get('system.site');

    return [
      'branding' => [
        'attributes' => [],
        'title' => (string) ($siteConfig->get('name') ?: 'Home'),
        'href' => Url::fromRoute('<front>')->toString(),
        'color' => 'primary',
        'size' => 'medium',
      ],
      'desktop_mainnavigation' => [
        'attributes' => [],
        'name' => (string) $this->t('Main navigation'),
        'links' => $mainNavigationLinks,
      ],
      'mobile_mainnavigation' => [
        'attributes' => [],
        'name' => (string) $this->t('Main navigation'),
        'orientation' => 'vertical',
        'links' => $mainNavigationLinks,
      ],
      'desktop_languageswitcher' => [
        'attributes' => [],
        'variant' => 'dropdown',
        'title' => (string) $this->t('Select language'),
        'links' => $languageLinks,
      ],
      'mobile_languageswitcher' => [
        'attributes' => [],
        'variant' => 'link-list',
        'title' => (string) $this->t('Select language'),
        'links' => $languageLinks,
      ],
      'desktop_usermenu' => $this->currentUser->isAuthenticated()
        ? [
          'attributes' => [],
          'variant' => 'dropdown',
          'title' => (string) $this->t('My account'),
          'links' => $userLinks,
        ]
        : [],
      'mobile_usermenu' => $this->currentUser->isAuthenticated()
        ? [
          'attributes' => [],
          'variant' => 'link-list',
          'title' => (string) $this->t('My account'),
          'links' => $userLinks,
        ]
        : [],
      'login_url' => Url::fromRoute('user.login')->toString(),
      'login_label' => (string) $this->t('Login'),
      'is_logged_in' => $this->currentUser->isAuthenticated(),
      'show_cart' => $cartSummary['show'],
      'cart_count' => $cartSummary['count'],
      'cart_url' => $cartSummary['url'],
      'cart_label' => (string) $this->t('Shopping cart'),
    ];
  }

  private function buildMainNavigationLinks(): array {
    $parameters = $this->menuLinkTree->getCurrentRouteMenuTreeParameters('main');
    $tree = $this->menuLinkTree->load('main', $parameters);
    $tree = $this->menuLinkTree->transform($tree, [
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ]);

    return array_values(array_map(
      static fn (MenuLinkTreeElement $element): array => [
        'title' => $element->link->getTitle(),
        'href' => $element->link->getUrlObject()->toString(),
        'active' => $element->inActiveTrail,
      ],
      $tree
    ));
  }

  private function buildLanguageLinks(): array {
    $currentLanguage = $this->languageManager->getCurrentLanguage()->getId();
    $links = [];

    foreach ($this->languageManager->getLanguages() as $language) {
      try {
        $url = Url::fromRoute('<current>', [], ['language' => $language])->toString();
      }
      catch (\Throwable) {
        $url = Url::fromRoute('<front>', [], ['language' => $language])->toString();
      }

      $links[] = [
        'title' => $language->getName(),
        'href' => $url,
        'active' => $language->getId() === $currentLanguage,
      ];
    }

    return $links;
  }

  private function buildUserLinks(): array {
    if (!$this->currentUser->isAuthenticated()) {
      return [];
    }

    $userId = (string) $this->currentUser->id();

    return [
      [
        'title' => (string) $this->t('My orders'),
        'href' => Url::fromUri("internal:/user/{$userId}/orders")->toString(),
      ],
      [
        'title' => (string) $this->t('My account'),
        'href' => Url::fromRoute('user.page')->toString(),
      ],
      [
        'title' => (string) $this->t('Logout'),
        'href' => Url::fromRoute('user.logout.confirm')->toString(),
      ],
    ];
  }

  private function buildCartSummary(): array {
    return [
      'show' => TRUE,
      'count' => 2,
      'url' => Url::fromRoute('commerce_cart.page')->toString(),
    ];
  }

}
