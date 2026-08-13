(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.siteHeaderVariant = {
    attach(context) {
      once('site-header-variant', '#site-header', context).forEach((header) => {
        const active = header.querySelector('[data-site-header-active]');
        const desktopTemplate = header.querySelector('[data-site-header-template="desktop"]');

        if (!active || !desktopTemplate) {
          return;
        }

        // Mobile markup is delivered as the no-JavaScript default. Store it in
        // a template after load so both variants can subsequently be moved,
        // rather than cloned, into the active container.
        const mobileTemplate = document.createElement('template');
        mobileTemplate.dataset.siteHeaderTemplate = 'mobile';
        mobileTemplate.content.append(...active.childNodes);
        header.append(mobileTemplate);

        const templates = {
          mobile: mobileTemplate,
          desktop: desktopTemplate,
        };
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        let activeVariant = 'mobile';

        // Put the mobile default back immediately. This avoids attaching its
        // Drupal behaviours a second time when JavaScript starts on mobile.
        active.append(mobileTemplate.content);

        const activate = (variant) => {
          if (variant === activeVariant) {
            return;
          }

          if (active.childNodes.length && activeVariant) {
            Drupal.detachBehaviors(active, drupalSettings, 'unload');
            templates[activeVariant].content.append(...active.childNodes);
          }

          active.append(templates[variant].content);
          Drupal.attachBehaviors(active, drupalSettings);
          activeVariant = variant;
        };

        const handleChange = ({ matches }) => {
          activate(matches ? 'desktop' : 'mobile');
        };

        handleChange(mediaQuery);
        mediaQuery.addEventListener('change', handleChange);
      });
    },
  };
})(Drupal, once);
