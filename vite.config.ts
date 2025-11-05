import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        core: 'src/core.ts', // Essential components only
        composables: 'src/composables.ts', // Composables
        forms: 'src/forms.ts', // Form components
        editor: 'src/editor.ts', // Rich text editor
        grid: 'src/grid.ts', // AG Grid components
        map: 'src/map.ts', // OpenLayers components
        widgets: 'src/widgets.ts', // Complex widgets
        services: 'src/services.ts', // HTTP services
        utils: 'src/utils.ts', // Utilities, composables, directives
        address: 'src/address.ts', // Address component
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        // Core Vue ecosystem
        'vue',
        'pinia',
        'vue-i18n',

        // Govflanders (always needed)
        '@govflanders/vl-ui-design-system-vue3',
        '@govflanders/vl-ui-design-system-style',

        // FontAwesome (always needed)
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',

        // Forms module dependencies
        '@vuelidate/core',
        '@vuelidate/validators',
        'date-fns',
        'libphonenumber-js',
        /^libphonenumber-js\//, // All libphonenumber-js submodules

        // Grid module dependencies
        'ag-grid-vue3',

        // Map module dependencies
        'jsts',
        'ol',
        /^ol\//, // All ol submodules
        'proj4',

        // Services module dependencies
        'axios',
        'axios-mock-adapter',
        '@vueuse/core',

        // Editors
        '@tinymce/tinymce-vue',
        'quill',
        /^quill\//, // All quill submodules
        'quill-html-edit-button',
        'quill-toggle-fullscreen-button',
        'vue-quilly',

        // Quill dependencies
        'parchment',
        /^parchment\//,
        'fast-diff',
        'lodash.clonedeep',
        'lodash.isequal',
        'quill-delta',
        /^quill-delta\//,

        // Other utilities
        '@soerenmartius/vue3-clipboard',
        'lodash-es',
      ],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          axios: 'axios',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue-components.css';
          return assetInfo.name as string;
        },
      },
      plugins: [
        visualizer({
          filename: 'dist/stats.html',
          open: true,
          gzipSize: true,
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
      '@core': resolve(__dirname, './src/components/core'),
      '@assets': resolve(__dirname, './src/assets'),
      '@components': resolve(__dirname, './src/components'),
      '@composables': resolve(__dirname, './src/composables'),
      '@directives': resolve(__dirname, './src/directives'),
      '@services': resolve(__dirname, './src/services'),
      '@stores': resolve(__dirname, './src/stores'),
      '@models': resolve(__dirname, './src/models'),
      '@utils': resolve(__dirname, './src/utils'),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
});
