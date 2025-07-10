export default {
  "**/*.{js,cjs,mjs,ts,tsx,astro}": [
    "eslint --fix",
    "prettier --write",
    "astro check",
  ],
  "**/*.{css,scss}": ["stylelint --fix", "prettier --write"],
  "**/*.feature": ["tsx scripts/remove-current-tags.ts", "prettier --write"],
  "**/*.{json,md,yml}": ["prettier --write"],
};
