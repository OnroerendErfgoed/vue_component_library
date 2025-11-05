import './main.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { VlIcon, VlLoader, installs } from '@govflanders/vl-ui-design-system-vue3';
import { setup } from '@storybook/vue3';
import { createPinia } from 'pinia';
import type { Preview } from '@storybook/vue3';

library.add(fas);

setup((app) => {
  app.use(installs.VlUiCoreInstall);
  app.use(installs.VlUiUtilInstall);
  app.component('VlIcon', VlIcon);
  app.component('VlLoader', VlLoader);
  app.use(createPinia());
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
