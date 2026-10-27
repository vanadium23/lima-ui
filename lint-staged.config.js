export default {
  "{src,features,scripts,utilities}/**/*.{js,cjs,mjs,ts,tsx,astro}": [
    "eslint --fix",
    "prettier --write",
    "astro check",
    "tsx scripts/commentChecker.ts",
  ],
  "configuration.ts": [
    "eslint --fix",
    "prettier --write",
    "astro check",
    "tsx scripts/commentChecker.ts",
  ],
  "{src,features,scripts,utilities}/**/*.{css,scss}": ["stylelint --fix", "prettier --write", "tsx scripts/commentChecker.ts"],
  "features/**/*.feature": ["tsx scripts/removeCurrentTags.ts", "prettier --write", "tsx scripts/commentChecker.ts"],
  "{src,features,scripts,utilities}/**/*.{json,md,yml}": ["prettier --write"],
  "*.{json,md,yml}": ["prettier --write"],
  ".github/workflows/*.{yml,yaml}": ["prettier --write"],
  "{src,utilities,scripts,features}/**/*": ["tsx scripts/pathCamelCaseChecker.ts"],
};
