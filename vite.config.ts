import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'VueComponents',
      formats: ['es'],
      fileName: (format) => `vue-components.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue', 'pinia'],
      output: {
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue-components.css';
          return assetInfo.name as string;
        },
      },
      plugins: [
        visualizer({
          filename: 'dist/stats.html',
          open: true,
        }),
      ],
    },
  },
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(__dirname, './src/utils/i18n.json'),
    }),
    viteStaticCopy({
      targets: [
        { src: 'src/scss/*', dest: 'scss' },
        { src: 'src/assets/*', dest: 'assets' },
      ],
    }),
    istanbul({
      include: 'src/components/*',
      exclude: ['node_modules', 'test/', 'coverage/'],
      extension: ['.js', '.ts', '.vue'],
      requireEnv: false,
      cypress: true, // Ensure Cypress tests are instrumented,
      forceBuildInstrument: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@assets': resolve(__dirname, './src/assets'),
      '@components': resolve(__dirname, './src/components'),
      '@directives': resolve(__dirname, './src/directives'),
      '@services': resolve(__dirname, './src/services'),
      '@models': resolve(__dirname, './src/models'),
      '@utils': resolve(__dirname, './src/utils'),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
});
