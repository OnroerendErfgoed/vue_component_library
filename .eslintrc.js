module.exports = {
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    'import/no-unresolved': 'error',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
