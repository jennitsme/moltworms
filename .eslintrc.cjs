/* eslint-env node */
const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: require("eslint-plugin-import"),
    },
    rules: {
      "import/order": ["warn", { "newlines-between": "always" }],
      "@typescript-eslint/no-explicit-any": "off", // allow any for payloads early stage
    },
  }
);
