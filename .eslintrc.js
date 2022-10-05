module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/function-component-definition': [
      2,
      {
        namedComponent: 'arrow-function',
        unnamedComponent: 'arrow-function',
      },
    ],
    'jsx-ally/no-noninteractive-element-interaction': 'off',
    'import/extensions': 0,
    'react/prop-types': 0,
    'linebreak-style': 0,
    'react/state-in-constructor': 0,
    'import/prefer-default-export': 0,
    'no-alert': 0,
    'no-console': 0,
    'consistent-return': 0,
    'import/react-in-jsx-scope': 0,
    'react/jsx-props-no-spreading': 0,
    'react/react-in-jsx-scope': 0,
    'react/no-unstable-nested-components': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'no-nested-ternary': 0,
    'max-len': [2, 550],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_d', '_dh', '_h', '_id', '_m', '_n', '_t', '_text'],
      },
    ],
    'object-curly-newline': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/alt-text': 0,
    'jsx-a11y/no-autofocus': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to', 'hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
  },
};
