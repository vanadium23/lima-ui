import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

// тест
const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
  process.exit(0);
}

try {
  const branchName = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

  if (branchName === "main") {
    console.error("❌ Коммиты в ветку main запрещены! Создайте отдельную ветку.");
    process.exit(1);
  }

  const commitMsg = readFileSync(commitMsgFile, "utf8");

  if (!commitMsg.startsWith(`${branchName}: `)) {
    writeFileSync(commitMsgFile, `${branchName}: ${commitMsg}`, "utf8");
  }
} catch (e) {
  console.error("Error in prepare-commit-msg script:", e);
  process.exit(0);
}
