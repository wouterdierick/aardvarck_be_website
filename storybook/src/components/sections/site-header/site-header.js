(() => {
	const selector = '.c-site-header';
	const scrollDeltaThreshold = 8;

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

	function initialiseSiteHeader(header) {
		if (header.dataset.siteHeaderInitialised) {
			return;
		}

		header.dataset.siteHeaderInitialised = 'true';

		const placeholder = document.createElement('div');
		placeholder.className = 'c-site-header__placeholder';
		placeholder.setAttribute('aria-hidden', 'true');
		header.before(placeholder);

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
