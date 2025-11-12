import './main.scss';
import { installs } from '@govflanders/vl-ui-design-system-vue3';
import { setup } from '@storybook/vue3';
import { createPinia } from 'pinia';
import type { Preview } from '@storybook/vue3';

setup((app) => {
  app.use(installs.VlUiCoreInstall);
  app.use(installs.VlUiUtilInstall);

  // Register global components that are forgotten in WU Vue3 and give warnings in console.
  // Consuming apps should register these themselves until fixed in WU.
  app.use(installs.VlIconInstall);
  app.use(installs.VlLoaderInstall);

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
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Documentation',
          'Core Module',
          'Forms Module',
          'Grid Module',
          'Map Module',
          'Services Module',
          'Editors Module',
        ],
      },
    },
  },
};

export default preview;
