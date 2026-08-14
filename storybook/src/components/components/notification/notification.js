(() => {
  const selector = '.c-notification';

  document.addEventListener('click', (event) => {
    const closeBtn = event.target.closest('.c-notification__close');
    if (!closeBtn) return;

    const notification = closeBtn.closest(selector);
    if (notification) {
      notification.remove();
    }
  });
})();
