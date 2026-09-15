import sortImports from '@trivago/prettier-plugin-sort-imports';

export default {
  plugins: [sortImports],
  arrowParens: 'always',
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
  semi: true,
  importOrder: [
    'css$',
    '<THIRD_PARTY_MODULES>',
    '^@(components|directives|services|models|utils|/)(.*)$',
    '<THIRD_PARTY_TS_TYPES>',
    '<TS_TYPES>^@(components|directives|services|models|utils|/)(.*)$',
  ],
  importOrderSortSpecifiers: true,
};
