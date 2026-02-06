/* eslint-env node */
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
  process.exit(0);
}

try {
  const branchName = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

  // Пропускаем, если мы в состоянии detached HEAD (название ветки HEAD)
  if (branchName === "HEAD" || !branchName) {
    process.exit(0);
  }

  const commitMsg = readFileSync(commitMsgFile, "utf8");

  // Если сообщение уже начинается с названия ветки, ничего не делаем
  // Используем регулярное выражение для проверки начала строки
  const escapedBranchName = branchName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const branchRegex = new RegExp(`^${escapedBranchName}\\s`);

  if (!branchRegex.test(commitMsg)) {
    const newCommitMsg = `${branchName} ${commitMsg}`;
    writeFileSync(commitMsgFile, newCommitMsg, "utf8");
  }
} catch (e) {
  // В случае ошибки просто выходим, чтобы не блокировать коммит
  console.error("Error in prepare-commit-msg script:", e);
  process.exit(0);
}
