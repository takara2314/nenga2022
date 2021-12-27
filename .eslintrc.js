module.exports = {
  env: {
    browser: true,
    es2015: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    },
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.eslint.json'
    ]
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    semi: [
      'error',
      'always'
    ]
  }
};
