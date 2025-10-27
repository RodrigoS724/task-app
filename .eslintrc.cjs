module.exports = {
  root: true,
  env: { browser: true, node: true, es2021: true },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'svelte3'],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    },
    {
      files: ['*.ts', '*.js'],
      env: { node: true }
    }
  ],
  settings: {
    // Indica la versión de Svelte para eslint-plugin-svelte3
    'svelte3/typescript': require('typescript'),
  },
  ignorePatterns: ['node_modules', 'build', 'dist', '.svelte-kit'],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  }
};
