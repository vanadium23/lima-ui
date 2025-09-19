import chalk from "chalk";

import { getFilesToCheck } from "./utilities/getFilesToCheck.ts";

type PathsData = {
  files: { [key: string]: string };
  directories: { [key: string]: string };
};

function collectPathsData(filePaths: string[]): PathsData {
  const pathsData: PathsData = {
    files: {},
    directories: {},
  };

  const processedDirectories = new Set<string>();

  for (const filePath of filePaths) {
    const directories = filePath.split("/");
    const fileName = directories.pop() || "";

    pathsData.files[fileName] = filePath;

    for (let i = 0; i < directories.length; i++) {
      const directoryPath = directories.slice(0, i + 1).join("/");
      const directoryName = directories[i];

      if (directoryName && !processedDirectories.has(directoryPath)) {
        pathsData.directories[directoryName] = directoryPath;
        processedDirectories.add(directoryPath);
      }
    }
  }

  return pathsData;
}

function checkPaths(pathsData: PathsData): string[] {
  const errors: string[] = [];

  const regExpFileName = /^([a-z][a-zA-Z]*|README)\.[a-z]+$/;
  const regExpDirectoryName = /^(\[[a-z][a-zA-Z]*]|[a-z][a-zA-Z]*)$/;

  for (const [fileName, filePath] of Object.entries(pathsData.files)) {
    if (!regExpFileName.test(fileName)) {
      errors.push(
        `❌ Имя файла 📄"${fileName}" по пути ${filePath} не соответствует camelCase правилам или содержит цифры`,
      );
    }
  }

  for (const [directoryName, directoryPath] of Object.entries(pathsData.directories)) {
    if (!regExpDirectoryName.test(directoryName)) {
      errors.push(
        `❌ Имя папки 📁"${directoryName}" по пути ${directoryPath} не соответствует camelCase правилам или содержит цифры`,
      );
    }
  }

  return errors;
}

function pathCamelCaseChecker() {
  const filesToCheck = getFilesToCheck();
  const pathsData = collectPathsData(filesToCheck);
  const errors = checkPaths(pathsData);

  if (errors.length === 0) {
    console.log(chalk.green("✅ Все имена файлов и папок соответствуют правилам наименования!"));
    process.exit(0);
  } else {
    console.log(chalk.red("\n❌ Найдены нарушения правил наименования:\n"));
    errors.forEach((error) => console.log(error));

    console.log(chalk.blue("\n📖 Подробные примеры проверки можно прочитать в корневом README.md"));

    process.exit(1);
  }
}

pathCamelCaseChecker();
