import type { DirectiveBinding } from 'vue';

export const vClickOutside = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mounted: (el: any, binding: DirectiveBinding) => {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event.target);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unmounted: (el: any) => {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};
