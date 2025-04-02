import codeCoverageTask from '@cypress/code-coverage/task.js';
import { defineConfig } from 'cypress';
import plugin from 'cypress-watch-and-reload/plugins.js';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config); // Use imported function
    },
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
  },
  component: {
    specPattern: 'src/**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    viewportWidth: 1000,
    viewportHeight: 660,
    env: {
      'cypress-watch-and-reload': {
        watch: ['src/**/*'],
      },
    },
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config); // Use imported function
      return plugin(on, config);
    },
    video: false,
  },
});
