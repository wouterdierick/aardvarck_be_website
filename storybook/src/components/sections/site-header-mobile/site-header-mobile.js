(() => {
  const selector = '.c-site-header-mobile';
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function setNavigationOpen(header, open) {
  const toggle = header.querySelector('.c-site-header-mobile__toggle');
  const close = header.querySelector('.c-site-header-mobile__close');
  const navigation = header.querySelector('.c-site-header-mobile__mobile-navigation');

  toggle.setAttribute('aria-expanded', String(open));
  toggle.hidden = open;
  close.hidden = !open;
  navigation.setAttribute('aria-hidden', String(!open));
  navigation.hidden = !open;

  if (open) {
    close.focus();
  }
  else {
    toggle.focus();
  }
}

function initialiseSiteHeaderMobile(header) {
  if (header.dataset.mobileNavigationInitialised) {
    return;
  }

  const toggle = header.querySelector('.c-site-header-mobile__toggle');
  const navigation = header.querySelector('.c-site-header-mobile__mobile-navigation');
  const close = header.querySelector('.c-site-header-mobile__close');

  if (!toggle || !navigation || !close) {
    return;
  }

  header.dataset.mobileNavigationInitialised = 'true';

  toggle.addEventListener('click', () => {
    setNavigationOpen(header, toggle.getAttribute('aria-expanded') !== 'true');
  });

  close.addEventListener('click', () => setNavigationOpen(header, false));

  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setNavigationOpen(header, false);
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    if (navigation.hidden) {
      return;
    }

    const focusable = [
      close,
      ...navigation.querySelectorAll(focusableSelector),
    ];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
    else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function initialiseSiteHeadersMobile() {
  document.querySelectorAll(selector).forEach(initialiseSiteHeaderMobile);
}

initialiseSiteHeadersMobile();

const observer = new MutationObserver(initialiseSiteHeadersMobile);
observer.observe(document.body, { childList: true, subtree: true });
})();
