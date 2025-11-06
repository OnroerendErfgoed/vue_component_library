import { defineConfig } from 'cypress';
import plugin from 'cypress-watch-and-reload/plugins.js';

export default defineConfig({
  /*
   blockHosts: Make sure we don't make requests to the real APIs during tests (these are mocked in the support/commands.ts file)
   Calls that are not mocked will fail and result in a 503 error
  */
  blockHosts: ['test-geo.onroerenderfgoed.be'],
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
  },
  component: {
    specPattern: 'src/**/__tests__/**/*.{cy,spec}.{js,ts,jsx,tsx}',
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
      // https://github.com/bahmutov/cypress-watch-and-reload
      return plugin(on, config);
    },
    video: false,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
