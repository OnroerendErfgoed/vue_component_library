import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';
import typescript2 from 'rollup-plugin-typescript2';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'VueComponents',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `vue-components.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue-components.css';
          return assetInfo.name as string;
        },
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
    dts({ insertTypesEntry: true, exclude: ['src/stories/**'] }),
    typescript2({
      check: false,
      include: ['src/components/**/*.vue', '*.ts+(|x)', '**/*.ts+(|x)'],
      exclude: ['vite.config.ts', 'src/stories/**/*.ts'],
    }),
    VueI18nPlugin({
      include: resolve(__dirname, './src/utils/i18n.json'),
    }),
    copy({
      targets: [{ src: 'src/scss/*', dest: 'dist/scss' }],
      hook: 'writeBundle',
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
