import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import parser from "astro-eslint-parser";
import { defineConfig, globalIgnores } from "eslint/config";
import _import from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/dist/",
    "**/.astro/",
    "**/*.d.ts",
    "**/node_modules/",
    "**/.husky/",
    "**/.idea/",
    "**/.vscode/",
    "**/*.iml",
    "**/.DS_Store",
    "**/Thumbs.db",
    "**/*.svg",
    "**/*.woff2",
    "**/package-lock.json",
    "eslint.config.mjs",
  ]),
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:astro/recommended",
      "prettier",
      "plugin:storybook/recommended",
    ),

    plugins: {
      "@typescript-eslint": typescriptEslint,
      "simple-import-sort": simpleImportSort,
      import: fixupPluginRules(_import),
      "@stylistic": stylistic,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        extraFileExtensions: [".mjs"],
      },
    },

    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [["^@?\\w"], ["^~"], ["^\\.\\.(?!/?$)"], ["^\\./", "^.+\\.css$"]],
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 0,
          maxBOF: 0,
        },
      ],

      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "always",
          astro: "always",
          ts: "always",
          tsx: "always",
          css: "always",
        },
      ],

      "import/no-unresolved": [
        "error",
        {
          caseSensitive: true,
          ignore: ["^@astrojs/.*", "^astro/.*"],
        },
      ],

      semi: ["error", "always"],

      "@stylistic/padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: ["interface", "type", "block-like"],
        },
        {
          blankLine: "always",
          prev: "import",
          next: "*",
        },
        {
          blankLine: "any",
          prev: "import",
          next: "import",
        },
        {
          blankLine: "always",
          prev: "*",
          next: "return",
        },
      ],
    },
  },
  {
    files: ["**/*.astro"],

    languageOptions: {
      parser: parser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
  },
  {
    files: ["**/*.tsx"],
    extends: compat.extends("plugin:solid/typescript"),
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
