import { readFileSync, writeFileSync } from "fs";

const files = process.argv.slice(2);

for (const file of files) {
  if (!file.endsWith(".feature")) {
    continue;
  }

  try {
    const content = readFileSync(file, "utf8");
    const updatedContent = content.replace(/\s+@current\b/g, "");

    if (content !== updatedContent) {
      writeFileSync(file, updatedContent);
    }
  } catch (error) {
    console.error(
      `Error processing ${file}:`,
      error instanceof Error ? error.message : "Unknown error",
    );

    process.exit(1);
  }
}

process.exit(0);
