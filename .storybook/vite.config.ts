import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(import.meta.dirname, '../src/utils/i18n.json'),
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, '../src'),
      '@assets': resolve(import.meta.dirname, '../src/assets'),
      '@components': resolve(import.meta.dirname, '../src/components'),
      '@composables': resolve(import.meta.dirname, '../src/composables'),
      '@directives': resolve(import.meta.dirname, '../src/directives'),
      '@services': resolve(import.meta.dirname, '../src/services'),
      '@stores': resolve(import.meta.dirname, '../src/stores'),
      '@models': resolve(import.meta.dirname, '../src/models'),
      '@utils': resolve(import.meta.dirname, '../src/utils'),
    },
  },
});
