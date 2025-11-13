import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(__dirname, '../src/utils/i18n.json'),
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@assets': resolve(__dirname, '../src/assets'),
      '@components': resolve(__dirname, '../src/components'),
      '@composables': resolve(__dirname, '../src/composables'),
      '@directives': resolve(__dirname, '../src/directives'),
      '@services': resolve(__dirname, '../src/services'),
      '@stores': resolve(__dirname, '../src/stores'),
      '@models': resolve(__dirname, '../src/models'),
      '@utils': resolve(__dirname, '../src/utils'),
    },
  },
});
