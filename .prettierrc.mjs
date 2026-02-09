/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro", "prettier-plugin-gherkin"],
  printWidth: 120, // DOC Максимальная длина строки для переноса
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
  singleQuote: false, // DOC Двойные кавычки
  bracketSpacing: true, // DOC Пробелы внутри фигурных скобок
};
