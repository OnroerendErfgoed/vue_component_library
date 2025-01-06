import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import { builtinModules } from 'module';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
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
      external: (id) => {
        const externalModules = ['vue', 'pinia'];
        // Exclude specific external modules, all node_modules, and built-in modules
        return externalModules.includes(id) || id.includes('node_modules') || builtinModules.includes(id);
      },
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
