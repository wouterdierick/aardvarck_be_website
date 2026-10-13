(() => {
	const selector = '.c-site-header';
	const scrollDeltaThreshold = 8;
	const headerBreakpointVariable = '--site-header-breakpoint';

	function getHeaderBreakpoint() {
		const value = window.getComputedStyle(document.documentElement)
			.getPropertyValue(headerBreakpointVariable)
			.trim();

		return value || '768px';
	}

	function getHeaderReservedHeight(header) {
		const computedStyle = window.getComputedStyle(header);
		const marginBottom = Number.parseFloat(computedStyle.marginBottom) || 0;

		return header.offsetHeight + marginBottom;
	}

	function syncPlaceholderHeight(header, placeholder) {
		if (!header.classList.contains('is-sticky-active')) {
			placeholder.style.height = '0px';
			return;
		}

		placeholder.style.height = `${getHeaderReservedHeight(header)}px`;
	}

	function setHeaderState(header, placeholder, state) {
		if (state === 'sticky') {
			if (header.classList.contains('is-sticky-visible')) {
				return;
			}

			header.classList.add('is-sticky-active');
			syncPlaceholderHeight(header, placeholder);
			void header.offsetHeight;

			window.requestAnimationFrame(() => {
				header.classList.add('is-sticky-visible');
			});
			return;
		}

		header.classList.remove('is-sticky-visible');

		if (state === 'top') {
			header.classList.remove('is-sticky-active');
		}

		syncPlaceholderHeight(header, placeholder);
	}

	function setNavigationOpen(header, open) {
		const toggle = header.querySelector('.c-site-header__menu-toggle');
		const close = header.querySelector('.c-site-header__menu-close');
		const drawer = header.querySelector('.c-site-header__drawer');

		if (!toggle || !close || !drawer) {
			return;
		}

		header.classList.toggle('is-navigation-open', open);
		toggle.setAttribute('aria-expanded', String(open));
		toggle.hidden = open;
		close.hidden = !open;
		drawer.setAttribute('aria-hidden', String(!open));
		drawer.hidden = !open;
	}

	function setUserMenuExpanded(menu, expanded) {
		const toggle = menu.querySelector('.c-user-menu__toggle');
		const list = menu.querySelector('.c-user-menu__list');

		if (!toggle || !list) {
			return;
		}

		toggle.setAttribute('aria-expanded', String(expanded));
		list.setAttribute('aria-hidden', String(!expanded));
		list.hidden = !expanded;
	}

	function initialiseNestedUserMenus(header) {
		header.querySelectorAll('.c-user-menu--dropdown').forEach((menu) => {
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
				setUserMenuExpanded(menu, !expanded);
			});

			menu.addEventListener('keydown', (event) => {
				if (event.key !== 'Escape') {
					return;
				}

				setUserMenuExpanded(menu, false);
				toggle.focus();
			});
		});

		document.addEventListener('click', (event) => {
			if (!header.contains(event.target)) {
				header.querySelectorAll('.c-user-menu--dropdown').forEach((menu) => {
					setUserMenuExpanded(menu, false);
				});
			}
		});
	}

	function initialiseSiteHeader(header) {
		if (header.dataset.siteHeaderInitialised) {
			return;
		}

		header.dataset.siteHeaderInitialised = 'true';

		const placeholder = document.createElement('div');
		placeholder.className = 'c-site-header__placeholder';
		placeholder.setAttribute('aria-hidden', 'true');
		header.before(placeholder);

		const toggle = header.querySelector('.c-site-header__menu-toggle');
		const close = header.querySelector('.c-site-header__menu-close');
		const drawer = header.querySelector('.c-site-header__drawer');
		const mediaQuery = window.matchMedia(`(min-width: ${getHeaderBreakpoint()})`);

		initialiseNestedUserMenus(header);

		if (toggle && close && drawer) {
			toggle.addEventListener('click', () => setNavigationOpen(header, true));
			close.addEventListener('click', () => setNavigationOpen(header, false));

			header.addEventListener('keydown', (event) => {
				if (event.key !== 'Escape') {
					return;
				}

				setNavigationOpen(header, false);
				toggle.focus();
			});

			mediaQuery.addEventListener('change', ({ matches }) => {
				if (matches) {
					setNavigationOpen(header, false);
				}
			});
		}

		header.addEventListener('transitionend', (event) => {
			if (event.propertyName !== 'transform') {
				return;
			}

			if (header.classList.contains('is-sticky-visible')) {
				return;
			}

			if (window.scrollY <= 0) {
				header.classList.remove('is-sticky-active');
				syncPlaceholderHeight(header, placeholder);
				return;
			}

			if (header.classList.contains('is-sticky-active')) {
				header.classList.remove('is-sticky-active');
				syncPlaceholderHeight(header, placeholder);
			}
		});

		let lastScrollY = window.scrollY;

		setHeaderState(header, placeholder, lastScrollY <= 0 ? 'top' : 'default');

		window.addEventListener('scroll', () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY <= 0) {
				setHeaderState(header, placeholder, 'top');
				lastScrollY = 0;
				return;
			}

			const scrollDifference = currentScrollY - lastScrollY;

			if (Math.abs(scrollDifference) < scrollDeltaThreshold) {
				return;
			}

			if (scrollDifference < 0) {
				setHeaderState(header, placeholder, 'sticky');
			}
			else {
				setHeaderState(header, placeholder, 'default');
			}

			lastScrollY = currentScrollY;
		}, { passive: true });

		window.addEventListener('resize', () => {
			syncPlaceholderHeight(header, placeholder);
		}, { passive: true });

		if (typeof ResizeObserver === 'function') {
			const resizeObserver = new ResizeObserver(() => {
				syncPlaceholderHeight(header, placeholder);
			});

			resizeObserver.observe(header);
		}
	}

	function initialiseSiteHeaders() {
		document.querySelectorAll(selector).forEach(initialiseSiteHeader);
	}

	initialiseSiteHeaders();

	const observer = new MutationObserver(initialiseSiteHeaders);
	observer.observe(document.body, { childList: true, subtree: true });
})();
