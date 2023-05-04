module.exports = {
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    // Make sure prettier is the last config defined in the extends array
    // as the order of the configs determine duplicate rules in different configs are handled
    // (later configs override previous ones)!
    'prettier',
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    // code quality and code style rules:
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    // to avoid conflicts, code formatting rules should go in .prettierrc!
    'prettier/prettier': 'error',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        extensions: ['.ts', '.tsx', '.vue'],
      },
    },
  },
};
