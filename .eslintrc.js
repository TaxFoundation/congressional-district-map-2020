module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    'react/jsx-uses-vars': 2,
    'react/jsx-uses-react': 2,
  },
};
