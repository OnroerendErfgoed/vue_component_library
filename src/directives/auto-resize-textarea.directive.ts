import { useEventListener } from '@vueuse/core';

export const vAutoResizeTextarea = {
  mounted(el: HTMLElement) {
    const adjustHeight = () => {
      el.style.resize = 'none';
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    };

    useEventListener(el, 'input', adjustHeight);

    // Adjust height on mount in case there's initial content
    adjustHeight();
  },
};
