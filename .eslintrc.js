module.exports = {
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    // override/add rules settings here, such as:
    'vue/no-unused-vars': 'error',
    'import/no-unresolved': 'error',
    semi: 'error',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        extensions: ['.ts', '.tsx'],
      },
    },
  },
};
