import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unsafe-optional-chaining": "error",
      // "no-undef": "error",
      "eqeqeq": ["error", "always"],
      "no-unexpected-multiline": "error",
      // "unicorn/no-unsafe-optional-chaining": "error", // if using eslint-plugin-unicorn
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginReact.configs.flat.recommended,
]);
