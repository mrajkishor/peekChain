
module.exports = {
  parser: "@babel/eslint-parser",
  extends: [
    'airbnb',
    'plugin:you-dont-need-lodash-underscore/all',
    'prettier',
  ],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
    mocha: true,
  },
  plugins: [
    'redux-saga',
    'react',
    'jsx-a11y',
    'you-dont-need-lodash-underscore',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
    ecmaFeatures: {
      jsx: true,
      spread: true,
      experimentalObjectRestSpread: true,
    },
  },
  globals: {
    __webpack_public_path__: true,
    window: true,
    document: true,
    isNaN: true,
  },
  rules: {
    'arrow-body-style': [2, 'as-needed'],
    camelcase: 0,
    'class-methods-use-this': 1,
    'consistent-return': 0,
    'guard-for-in': 0,
    'import/extensions': 0,
    'import/namespace': 1,
    'import/newline-after-import': 1,
    'import/no-cycle': 1,
    'import/no-dynamic-require': 1,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-named-as-default': 1,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/aria-props': 2,
    'jsx-a11y/heading-has-content': 0,
    'jsx-a11y/label-has-for': [2, {
      components: ['Label'],
      required: { some: ['nesting', 'id'] },
      allowChildren: false,
    }],
    'jsx-a11y/no-static-element-interactions': 2,
    'jsx-a11y/mouse-events-have-key-events': 2,
    'jsx-a11y/role-supports-aria-props': 2,
    'linebreak-style': 0,
    'newline-per-chained-call': 0,
    'no-alert': 2,
    'no-case-declarations': 0,
    'no-console': 0,
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'no-restricted-syntax': 0,
    'no-self-assign': 1,
    'no-underscore-dangle': [1, { allow: ['_uxa', '__satelliteLoaded'] }],
    'no-use-before-define': 0,
    'no-useless-return': 0,
    'prefer-object-spread': 2,
    'prefer-template': 1,
    'react/button-has-type': 2,
    'react/destructuring-assignment': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-fragments': 0,
    'react/jsx-no-bind': 1,
    'react/jsx-no-target-blank': 0,
    'react/jsx-props-no-spreading': 1,
    'react/prefer-stateless-function': 1,
    'react/no-access-state-in-setstate': 2,
    'react/no-array-index-key': 2,
    'react/no-danger': 0,
    'react/no-danger-with-children': 1,
    'react/no-unsafe': 1,
    'react/require-default-props': 0,
    'react/self-closing-comp': 2,
    'react/static-property-placement': 0,
    treatUndefinedAsUnspecified: 0,
  },
};
