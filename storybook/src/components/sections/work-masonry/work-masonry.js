(() => {
  const selector = '.c-work-masonry';
  const gap = 32;

  function getColumnCount(masonry) {
    const tablet = Number(masonry.dataset.workMasonryTablet || 600);
    const desktop = Number(masonry.dataset.workMasonryDesktop || 1024);

    if (window.innerWidth >= desktop) {
      return 3;
    }

    return window.innerWidth >= tablet ? 2 : 1;
  }

  function initialiseWorkMasonry(masonry) {
    if (masonry.dataset.workMasonryInitialised) {
      return;
    }

    const container = masonry.querySelector('.c-work-masonry__items');
    if (!container) {
      return;
    }

    masonry.dataset.workMasonryInitialised = 'true';
    const items = [...container.children];
    let animationFrame;

    const layout = () => {
      const columns = getColumnCount(masonry);
      const columnWidth = (container.clientWidth - gap * (columns - 1)) / columns;
      const columnHeights = Array(columns).fill(0);

      items.forEach((item) => {
        item.style.width = `${columnWidth}px`;
        item.style.position = 'absolute';
      });

      items.forEach((item) => {
        const column = columnHeights.indexOf(Math.min(...columnHeights));
        const top = columnHeights[column];

        item.style.transform = `translate(${column * (columnWidth + gap)}px, ${top}px)`;
        columnHeights[column] += item.offsetHeight + gap;
      });

      container.style.height = `${Math.max(...columnHeights) - gap}px`;
    };

    const requestLayout = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(layout);
    };

    container.querySelectorAll('img').forEach((image) => {
      image.addEventListener('load', requestLayout);
    });

    new ResizeObserver(requestLayout).observe(container);
    window.addEventListener('resize', requestLayout);
    requestLayout();
  }

  function initialiseWorkMasonries() {
    document.querySelectorAll(selector).forEach(initialiseWorkMasonry);
  }

  initialiseWorkMasonries();

  new MutationObserver(initialiseWorkMasonries)
    .observe(document.body, { childList: true, subtree: true });
})();
