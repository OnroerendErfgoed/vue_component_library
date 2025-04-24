export const vAutoResizeTextarea = {
  mounted(el: HTMLElement) {
    const adjustHeight = () => {
      el.style.resize = 'none';
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    };

    el.addEventListener('input', adjustHeight);

    // Adjust height on mount in case there's initial content
    adjustHeight();
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('input', () => {});
  },
};
