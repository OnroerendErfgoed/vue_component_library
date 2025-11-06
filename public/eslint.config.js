import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/static/**',
      '**/storybook-static/**',
      '**/cypress/**',
      '**/public/**',
    ],
  },

  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig({
    rootDir: projectRoot,
  }),

  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: projectRoot,
      },
    },
  },

  skipFormatting,
];
