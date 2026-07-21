module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'deprecation'
  ],
  rules: {
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' }
    ],
    'deprecation/deprecation': 'warn'
  },
  ignorePatterns: ['node_modules/', 'babel.config.js', 'metro.config.js', 'jest.config.js', 'tailwind.config.js', 'scripts/', '.expo/', 'web-client/']
};
