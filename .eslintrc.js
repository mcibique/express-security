module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2017,
  },
  plugins: [
    "security",
    "pug",
  ],
  extends: [
    "semistandard",
    "plugin:security/recommended",
  ],
  env: {
    es6: true,
  },
  rules: {
    "space-before-function-paren": [2, {
      "anonymous": "always",
      "named": "never"
    }],
  },
};
