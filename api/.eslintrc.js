const config = {
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  rules: {
    'no-console': [
      'error',
      {
        allow: ['error'],
      },
    ],
    /**
     * Imports
     */
    '@typescript-eslint/no-unused-vars': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
      },
    ],
  },
  extends: [
    'eslint:recommended',
    /**
     * Ts
     */
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    /**
     * Prettier
     */
    'prettier',
    'plugin:prettier/recommended',

    /**
     * Imports
     */
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint', 'import'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}

module.exports = config
