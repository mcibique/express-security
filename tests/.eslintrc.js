module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    "mocha",
  ],
  rules: {
    "no-unused-expressions": 0,
    "space-before-function-paren": [2, {
      "anonymous": "always",
      "named": "never"
    }],
  },
};
