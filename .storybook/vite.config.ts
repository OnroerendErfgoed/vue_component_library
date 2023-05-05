import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      include: resolve(__dirname, './src/utils/i18n.ts'),
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@assets': resolve(__dirname, '../src/assets'),
      '@components': resolve(__dirname, '../src/components'),
      '@services': resolve(__dirname, '../src/services'),
      '@models': resolve(__dirname, '../src/models'),
      '@utils': resolve(__dirname, '../src/utils'),
    },
  },
});
