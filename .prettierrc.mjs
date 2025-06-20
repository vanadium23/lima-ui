/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro", "prettier-plugin-gherkin"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: "*.md",
      options: {
        proseWrap: "never",
      },
    },
    {
      files: "*.feature",
      options: {
        parser: "gherkin",
      },
    },
  ],
  singleQuote: false, // Двойные кавычки
  bracketSpacing: true, // пробелы внутри фигурных скобок
};
