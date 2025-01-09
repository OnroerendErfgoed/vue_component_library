import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';

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
    ],
  },

  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  // Skip formatting rules, these are handled by the format command that runs prettier
  skipFormatting,
];
