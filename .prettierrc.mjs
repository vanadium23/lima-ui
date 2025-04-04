/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
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
  ],
  singleQuote: false, // Двойные кавычки
  bracketSpacing: true, // пробелы внутри фигурных скобок
};
