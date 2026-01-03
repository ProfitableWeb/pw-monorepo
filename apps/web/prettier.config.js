module.exports = {
  // Line length and formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,

  // Semicolons and quotes
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',

  // Trailing commas and brackets
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions
  arrowParens: 'avoid',

  // JSX formatting
  jsxSingleQuote: true,

  // File types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'always',
        printWidth: 120,
      },
    },
    {
      files: ['*.scss', '*.css'],
      options: {
        printWidth: 120,
        singleQuote: false,
      },
    },
  ],

  // Ignore patterns
  ignorePath: '.prettierignore',
};
