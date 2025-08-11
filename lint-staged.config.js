export default {
  "**/*.{js,cjs,mjs,ts,tsx,astro}": [
    "eslint --fix",
    "prettier --write",
    "astro check",
  ],
  "**/*.{css,scss}": ["stylelint --fix", "prettier --write"],
  "**/*.feature": ["tsx scripts/removeCurrentTags.ts", "prettier --write"],
  "**/*.{json,md,yml}": ["prettier --write"],
  "{src,utilities,scripts,features}/**/*": [
    "tsx scripts/pathCamelCaseChecker.ts",
  ],
};
