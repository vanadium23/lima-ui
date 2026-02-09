export default {
  "**/*.{js,cjs,mjs,ts,tsx,astro}": [
    "eslint --fix",
    "prettier --write",
    "astro check",
    "tsx scripts/commentChecker.ts",
  ],
  "**/*.{css,scss}": ["stylelint --fix", "prettier --write", "tsx scripts/commentChecker.ts"],
  "**/*.feature": ["tsx scripts/removeCurrentTags.ts", "prettier --write", "tsx scripts/commentChecker.ts"],
  "**/*.{json,md,yml}": ["prettier --write"],
  "{src,utilities,scripts,features}/**/*": ["tsx scripts/pathCamelCaseChecker.ts"],
};
