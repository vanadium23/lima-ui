import chalk from "chalk";
import { stat } from "fs/promises";
import { basename, dirname, extname, relative, resolve } from "path";

import { getFilesToCheck } from "./utilities/getFilesToCheck.ts";

const EXCLUDED = [
  ".husky",
  ".vscode",
  ".idea",
  ".github",
  "package-lock.json",
  "README.md",
  "lint-staged.config.js",
  "public/fonts",
];

// Проверяет, соответствует ли имя файла camelCase правилам
// - Начинается с маленькой буквы, точки или квадратной скобки [
// - Может содержать большие буквы в середине
// - Разрешены точки в имени файла (но не две подряд)
// - Разрешены квадратные скобки для динамических роутов [name]
function isCamelCaseFileName(fileName: string): boolean {
  // Удаляем расширение для проверки основной части имени
  const nameWithoutExt = basename(fileName, extname(fileName));

  // Проверяем файлы в квадратных скобках (динамические роуты)
  if (nameWithoutExt.startsWith("[") && nameWithoutExt.endsWith("]")) {
    const nameInBrackets = nameWithoutExt.slice(1, -1);

    // Содержимое скобок должно следовать camelCase
    return /^[a-z][a-zA-Z0-9]*$/.test(nameInBrackets);
  }

  // Проверяем на две точки подряд (недопустимо)
  if (nameWithoutExt.includes("..")) {
    return false;
  }

  // Разрешаем файлы, начинающиеся с точки (например, .gitignore, .env)
  if (nameWithoutExt.startsWith(".")) {
    const nameAfterFirstDot = nameWithoutExt.slice(1);
    if (nameAfterFirstDot.length === 0) return true; // только точка

    // Разбиваем по точкам и проверяем каждую часть
    const parts = nameAfterFirstDot.split(".");

    return parts.every(
      (part) => part.length > 0 && /^[a-z][a-zA-Z0-9]*$/.test(part),
    );
  }

  // Для обычных файлов: разбиваем по точкам и проверяем каждую часть
  const parts = nameWithoutExt.split(".");

  return parts.every(
    (part) => part.length > 0 && /^[a-z][a-zA-Z0-9]*$/.test(part),
  );
}

// Проверяет, соответствует ли имя папки camelCase правилам
function isCamelCaseDirName(dirName: string): boolean {
  // Проверяем папки в квадратных скобках (динамические роуты)
  if (dirName.startsWith("[") && dirName.endsWith("]")) {
    const nameInBrackets = dirName.slice(1, -1);

    // Содержимое скобок должно следовать camelCase
    return /^[a-z][a-zA-Z0-9]*$/.test(nameInBrackets);
  }

  // Проверяем на две точки подряд (недопустимо)
  if (dirName.includes("..")) {
    return false;
  }

  // Разрешаем папки, начинающиеся с точки
  if (dirName.startsWith(".")) {
    const nameAfterFirstDot = dirName.slice(1);
    if (nameAfterFirstDot.length === 0) return true; // только точка

    // Разбиваем по точкам и проверяем каждую часть
    const parts = nameAfterFirstDot.split(".");

    return parts.every(
      (part) => part.length > 0 && /^[a-z][a-zA-Z0-9]*$/.test(part),
    );
  }

  // Для обычных папок: разбиваем по точкам и проверяем каждую часть
  const parts = dirName.split(".");

  return parts.every(
    (part) => part.length > 0 && /^[a-z][a-zA-Z0-9]*$/.test(part),
  );
}

// Проверяет, следует ли исключить элемент из проверки
function shouldExclude(filePath: string) {
  return EXCLUDED.some((excluded) => filePath.startsWith(excluded));
}

// Проверяет, находится ли путь внутри корневой папки проекта
function isInsideProject(filePath: string, projectRoot: string): boolean {
  const resolvedFilePath = resolve(filePath);
  const resolvedProjectRoot = resolve(projectRoot);
  const relativePath = relative(resolvedProjectRoot, resolvedFilePath);

  // Если путь начинается с "../", значит он находится выше корня проекта
  // Также проверяем, что это не сам корень проекта
  return !relativePath.startsWith("../") && relativePath !== "";
}

// Проверяет конкретные файлы из списка
async function checkSpecificFiles(filePaths: string[]): Promise<string[]> {
  const errors: string[] = [];
  const checkedDirs = new Set<string>();
  const projectRoot = process.cwd();

  for (const filePath of filePaths) {
    if (shouldExclude(filePath)) {
      continue;
    }

    try {
      const stats = await stat(filePath);
      const fileName = basename(filePath);

      if (stats.isDirectory()) {
        // Проверяем имя папки
        if (!isCamelCaseDirName(fileName)) {
          errors.push(
            `❌ Папка "${filePath}" не соответствует camelCase правилам`,
          );
        }

        // Проверяем имя файла
        if (!isCamelCaseFileName(fileName)) {
          errors.push(
            `❌ Файл "${filePath}" не соответствует camelCase правилам`,
          );
        }

        // Проверяем все родительские папки файла (только внутри проекта)
        let currentDir = dirname(resolve(filePath));
        const projectRootResolved = resolve(projectRoot);

        while (
          currentDir !== projectRootResolved &&
          isInsideProject(currentDir, projectRoot) &&
          !checkedDirs.has(currentDir)
        ) {
          checkedDirs.add(currentDir);
          const dirName = basename(currentDir);
          const relativeDirPath = relative(projectRoot, currentDir);

          if (!shouldExclude(dirName)) {
            if (!isCamelCaseDirName(dirName)) {
              errors.push(
                `❌ Папка "${relativeDirPath}" не соответствует camelCase правилам`,
              );
            }
          }

          currentDir = dirname(currentDir);
        }
      }
    } catch (error) {
      // Файл может быть удален между получением списка и проверкой
      console.warn(
        chalk.yellow(`⚠️ Не удалось проверить ${filePath}: ${error}`),
      );
    }
  }

  return errors;
}

async function pathCamelCaseChecker() {
  const filesToCheck = getFilesToCheck();

  try {
    const errors = await checkSpecificFiles(filesToCheck);

    if (errors.length === 0) {
      console.log(
        chalk.green(
          "✅ Все имена файлов и папок соответствуют правилам наименования!",
        ),
      );
      process.exit(0);
    } else {
      console.log(chalk.red("\n❌ Найдены нарушения правил наименования:\n"));
      errors.forEach((error) => console.log(error));

      console.log(
        chalk.blue(
          "\n📖 Подробные примеры проверки можно прочитать в корневом README.md",
        ),
      );

      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`❌ Ошибка при проверке: ${error}`));
    process.exit(1);
  }
}

pathCamelCaseChecker();
