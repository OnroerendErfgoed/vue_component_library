import './main.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { VlUiCore, VlUiUtil } from '@govflanders/vl-ui-design-system-vue3';
import { setup } from '@storybook/vue3';
import type { Preview } from '@storybook/vue3';

library.add(fas);
library.add(far);
library.add(fab);

setup((app) => {
  app.use(VlUiCore);
  app.use(VlUiUtil);
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
