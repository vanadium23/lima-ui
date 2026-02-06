import { readFileSync } from "fs";

const files = process.argv.slice(2);
const errors: string[] = [];

const allowedPrefixes = ["DOC", "TODO", "eslint", "@ts-", "prettier", "stylelint", "noinspection"];

function isAllowed(text: string): boolean {
  return allowedPrefixes.some((prefix) => text.startsWith(prefix));
}

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");

  for (const [i, rawLine] of lines.entries()) {
    const line = rawLine.trim();

    // TODO тест
    const singleMatch = line.match(/^\/\/\s*(.+)/);
    const singleText = singleMatch?.[1]?.trim();

    // DOC тест2
    if (singleText && !isAllowed(singleText)) {
      errors.push(`${file}:${i + 1} — // ${singleText}`);
    }

    const inlineMultiMatch = line.match(/^\/\*(?!\*)\s*(.*?)\s*\*\/$/);
    const inlineText = inlineMultiMatch?.[1]?.trim();

    if (inlineText && !isAllowed(inlineText)) {
      errors.push(`${file}:${i + 1} — /* ${inlineText} */`);
      continue;
    }

    const multiStartMatch = line.match(/^\/\*(?!\*)\s*(.+)/);
    const multiText = multiStartMatch?.[1]?.replace(/\*\/\s*$/, "").trim();

    if (multiText && !isAllowed(multiText)) {
      errors.push(`${file}:${i + 1} — /* ${multiText}`);
    }
  }
}

if (errors.length > 0) {
  console.error("❌ Найдены комментарии без допустимого префикса:\n");
  errors.forEach((e) => console.error(`  ${e}`));
  console.error(`\nДопустимые префиксы: ${allowedPrefixes.join(", ")}`);
  process.exit(1);
}
