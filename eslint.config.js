const expoConfig = require("eslint-config-expo/flat");
const eslintConfigPrettier = require("eslint-config-prettier/flat");

module.exports = [
  ...expoConfig,
  eslintConfigPrettier,
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "web-build/**",
      "*.config.js",
      "babel.config.js",
      "metro.config.js",
    ],
  },
];
