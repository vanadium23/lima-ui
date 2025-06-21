export default {
  "**/*.{js,cjs,mjs,ts,tsx,astro}": [
    "eslint --fix",
    "prettier --write",
    "astro check",
  ],
  "**/*.{css,scss}": ["stylelint --fix", "prettier --write"],
  "**/*.{json,md,yml,feature}": ["prettier --write"],
};
