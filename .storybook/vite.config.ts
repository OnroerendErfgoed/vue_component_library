import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@assets': resolve(__dirname, '../src/assets'),
      '@components': resolve(__dirname, '../src/components'),
      '@services': resolve(__dirname, '../src/services'),
      '@models': resolve(__dirname, '../src/models'),
    },
  },
});
