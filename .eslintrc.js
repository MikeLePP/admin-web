module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['airbnb-typescript', 'prettier'],
  plugins: ['prettier'],
  rules: {
    '@typescript-eslint/comma-dangle': 'off',
    'class-methods-use-this': 'off',
    'comma-dangle': 'off',
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'max-len': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'object-curly-newline': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-max-props-per-line': [
      1,
      {
        when: 'always',
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
  },
};
