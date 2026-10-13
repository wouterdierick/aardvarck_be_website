(() => {
  const selector = '.c-user-menu--dropdown';

  function setExpanded(menu, expanded) {
    const toggle = menu.querySelector('.c-user-menu__toggle');
    const list = menu.querySelector('.c-user-menu__list');

    if (!toggle || !list) {
      return;
    }

    toggle.setAttribute('aria-expanded', String(expanded));
    list.setAttribute('aria-hidden', String(!expanded));
    list.hidden = !expanded;
  }

  function initialiseUserMenu(menu) {
    if (menu.dataset.userMenuInitialised) {
      return;
    }

    const toggle = menu.querySelector('.c-user-menu__toggle');

    if (!toggle) {
      return;
    }

    menu.dataset.userMenuInitialised = 'true';

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      setExpanded(menu, !expanded);
    });

    menu.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      setExpanded(menu, false);
      toggle.focus();
    });

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target)) {
        setExpanded(menu, false);
      }
    });
  }

  function initialiseUserMenus() {
    document.querySelectorAll(selector).forEach(initialiseUserMenu);
  }

  initialiseUserMenus();

  const observer = new MutationObserver(initialiseUserMenus);
  observer.observe(document.body, { childList: true, subtree: true });
})();
