(() => {
  const selector = '.c-language-switcher--dropdown';

function setExpanded(switcher, expanded) {
  const toggle = switcher.querySelector('.c-language-switcher__toggle');
  const list = switcher.querySelector('.c-language-switcher__list');

  toggle.setAttribute('aria-expanded', String(expanded));
  list.setAttribute('aria-hidden', String(!expanded));
  list.hidden = !expanded;
}

function initialiseLanguageSwitcher(switcher) {
  if (switcher.dataset.languageSwitcherInitialised) {
    return;
  }

  const toggle = switcher.querySelector('.c-language-switcher__toggle');
  const links = switcher.querySelectorAll('.c-language-switcher__link');

  if (!toggle) {
    return;
  }

  switcher.dataset.languageSwitcherInitialised = 'true';

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    setExpanded(switcher, !expanded);
  });

  toggle.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown') {
      return;
    }

    event.preventDefault();
    setExpanded(switcher, true);
    links[0]?.focus();
  });

  links.forEach((link, index) => {
    link.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
        return;
      }

      event.preventDefault();

      if (event.key === 'ArrowUp' && index === 0) {
        toggle.focus();
        return;
      }

      const nextIndex = event.key === 'ArrowDown'
        ? (index + 1) % links.length
        : index - 1;
      links[nextIndex].focus();
    });
  });

  switcher.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    setExpanded(switcher, false);
    toggle.focus();
  });

  document.addEventListener('click', (event) => {
    if (!switcher.contains(event.target)) {
      setExpanded(switcher, false);
    }
  });
}

function initialiseLanguageSwitchers() {
  document.querySelectorAll(selector).forEach(initialiseLanguageSwitcher);
}

initialiseLanguageSwitchers();

const observer = new MutationObserver(initialiseLanguageSwitchers);
observer.observe(document.body, { childList: true, subtree: true });
})();
