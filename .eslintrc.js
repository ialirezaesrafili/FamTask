module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:import/recommended',
      'prettier',
    ],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always'
      }],
    },
    overrides: [
      {
        files: ['**/*.jsx'],
        extends: ['plugin:react/recommended'],
        settings: {
          react: {
            version: 'detect'
          }
        }
      }
    ]
  };