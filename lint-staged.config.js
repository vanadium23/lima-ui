export default {
  "**/*.{ts,tsx}": () => "tsc --noEmit --pretty --project tsconfig.json",
  "**/*.astro": "astro check",
  "**/*.{js,cjs,mjs,astro,ts,tsx}": ["eslint --fix", "prettier --write"],
  "**/*.{css,scss}": ["stylelint --fix", "prettier --write"],
  "**/*.{json,md,yml,feature}": ["prettier --write"],
};
