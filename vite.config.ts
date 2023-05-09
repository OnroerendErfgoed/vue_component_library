import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/index.ts'),
      name: 'VueComponents',
      fileName: `vue-components`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(__dirname, './src/utils/i18n.json'),
    }),
    copy({
      targets: [{ src: 'src/scss', dest: 'dist/style' }],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@assets': resolve(__dirname, './src/assets'),
      '@components': resolve(__dirname, './src/components'),
      '@services': resolve(__dirname, './src/services'),
      '@models': resolve(__dirname, './src/models'),
      '@utils': resolve(__dirname, './src/utils'),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
});
