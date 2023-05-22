import { AdresCrab, OeTest } from '@/components';
import type { App } from 'vue';

export default {
  install: (app: App) => {
    app.component('AdresCrab', AdresCrab);
    app.component('OeTest', OeTest);
  },
};

export { AdresCrab, OeTest };
