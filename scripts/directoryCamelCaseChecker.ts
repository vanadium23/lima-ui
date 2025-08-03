import chalk from "chalk";
import { readdir, stat } from "fs/promises";
import { basename, dirname, extname, join, relative, resolve } from "path";

// Папки и файлы, которые следует исключить из проверки
const DEFAULT_EXCLUDED_DIRS = [
  "node_modules",
  ".git",
  ".husky",
  ".astro",
  ".vscode",
  ".idea",
  ".github",
];

const DEFAULT_EXCLUDED_FILES = [
  "package-lock.json",
  "README.md",
  "lint-staged.config.js",
];

// Пути к папкам, которые следует исключить из проверки (относительно корня проекта)
const DEFAULT_EXCLUDED_PATHS = ["features/results", "public/fonts"];

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
function shouldExclude(
  itemName: string,
  isDirectory: boolean,
  relativePath: string,
  excludedDirs: string[],
  excludedFiles: string[],
  excludedPaths: string[],
): boolean {
  // Проверяем исключение по полному пути
  const normalizedRelativePath = relativePath.replace(/\\/g, "/");

  if (
    excludedPaths.some((excludedPath) => {
      const normalizedExcludedPath = excludedPath.replace(/\\/g, "/");

      return (
        normalizedRelativePath === normalizedExcludedPath ||
        normalizedRelativePath.startsWith(normalizedExcludedPath + "/")
      );
    })
  ) {
    return true;
  }

  // Проверяем исключение по имени файла/папки
  if (isDirectory) {
    return excludedDirs.includes(itemName);
  } else {
    return excludedFiles.includes(itemName);
  }
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
async function checkSpecificFiles(
  filePaths: string[],
  excludedDirs: string[] = DEFAULT_EXCLUDED_DIRS,
  excludedFiles: string[] = DEFAULT_EXCLUDED_FILES,
  excludedPaths: string[] = DEFAULT_EXCLUDED_PATHS,
): Promise<string[]> {
  const errors: string[] = [];
  const checkedDirs = new Set<string>();
  const projectRoot = process.cwd();

  for (const filePath of filePaths) {
    try {
      // Проверяем, что файл находится внутри проекта
      if (!isInsideProject(filePath, projectRoot)) {
        continue;
      }

      const stats = await stat(filePath);
      const fileName = basename(filePath);
      const relativePath = relative(projectRoot, filePath);

      // Проверяем исключения
      if (
        shouldExclude(
          fileName,
          stats.isDirectory(),
          relativePath,
          excludedDirs,
          excludedFiles,
          excludedPaths,
        )
      ) {
        continue;
      }

      if (stats.isDirectory()) {
        // Проверяем имя папки
        if (!isCamelCaseDirName(fileName)) {
          errors.push(
            `❌ Папка "${relativePath}" не соответствует camelCase правилам`,
          );
        }
      } else {
        // Проверяем имя файла
        if (!isCamelCaseFileName(fileName)) {
          errors.push(
            `❌ Файл "${relativePath}" не соответствует camelCase правилам`,
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

          if (
            !shouldExclude(
              dirName,
              true,
              relativeDirPath,
              excludedDirs,
              excludedFiles,
              excludedPaths,
            )
          ) {
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

// Рекурсивно проверяет все файлы и папки в директории (для режима полной проверки)
async function checkDirectory(
  dirPath: string,
  relativePath: string = "",
  excludedDirs: string[] = DEFAULT_EXCLUDED_DIRS,
  excludedFiles: string[] = DEFAULT_EXCLUDED_FILES,
  excludedPaths: string[] = DEFAULT_EXCLUDED_PATHS,
): Promise<string[]> {
  const errors: string[] = [];

  try {
    const items = await readdir(dirPath);

    for (const item of items) {
      const fullPath = join(dirPath, item);
      const itemRelativePath = relativePath ? join(relativePath, item) : item;
      const stats = await stat(fullPath);

      // Проверяем, нужно ли исключить этот элемент
      if (
        shouldExclude(
          item,
          stats.isDirectory(),
          itemRelativePath,
          excludedDirs,
          excludedFiles,
          excludedPaths,
        )
      ) {
        continue;
      }

      if (stats.isDirectory()) {
        // Проверяем имя папки
        if (!isCamelCaseDirName(item)) {
          errors.push(
            `❌ Папка "${itemRelativePath}" не соответствует camelCase правилам`,
          );
        }

        // Рекурсивно проверяем содержимое папки
        const subErrors = await checkDirectory(
          fullPath,
          itemRelativePath,
          excludedDirs,
          excludedFiles,
          excludedPaths,
        );
        errors.push(...subErrors);
      } else {
        // Проверяем имя файла
        if (!isCamelCaseFileName(item)) {
          errors.push(
            `❌ Файл "${itemRelativePath}" не соответствует camelCase правилам`,
          );
        }
      }
    }
  } catch (error) {
    errors.push(
      `❌ Ошибка при чтении директории ${relativePath || dirPath}: ${error}`,
    );
  }

  return errors;
}

async function main() {
  // Получаем список файлов из аргументов командной строки (от lint-staged)
  const filesToCheck = process.argv
    .slice(2)
    .filter((arg) => !arg.startsWith("--"));

  // Проверяем дополнительные аргументы
  const args = process.argv.slice(2);
  const excludeDirsArg = args
    .find((arg) => arg.startsWith("--exclude-dirs="))
    ?.split("=")[1];
  const excludeFilesArg = args
    .find((arg) => arg.startsWith("--exclude-files="))
    ?.split("=")[1];
  const excludePathsArg = args
    .find((arg) => arg.startsWith("--exclude-paths="))
    ?.split("=")[1];
  const fullCheckArg = args.includes("--full-check");

  const excludedDirs = excludeDirsArg
    ? excludeDirsArg.split(",")
    : DEFAULT_EXCLUDED_DIRS;
  const excludedFiles = excludeFilesArg
    ? excludeFilesArg.split(",")
    : DEFAULT_EXCLUDED_FILES;
  const excludedPaths = excludePathsArg
    ? excludePathsArg.split(",")
    : DEFAULT_EXCLUDED_PATHS;

  // Определяем режим работы
  if (fullCheckArg || filesToCheck.length === 0) {
    // Режим полной проверки проекта
    console.log(
      chalk.blue("🔍 Проверка имен файлов и папок во всем проекте..."),
    );

    try {
      const errors = await checkDirectory(
        process.cwd(),
        "",
        excludedDirs,
        excludedFiles,
        excludedPaths,
      );

      if (errors.length === 0) {
        console.log(
          chalk.green(
            "✅ Все имена файлов и папок соответствуют camelCase правилам!",
          ),
        );
        process.exit(0);
      } else {
        console.log(chalk.red("\n❌ Найдены нарушения camelCase правил:\n"));
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
  } else {
    // Режим проверки конкретных файлов (от lint-staged)
    console.log(
      chalk.blue(
        `🔍 Проверка имен файлов и папок для ${filesToCheck.length} измененных файлов...`,
      ),
    );

    try {
      const errors = await checkSpecificFiles(
        filesToCheck,
        excludedDirs,
        excludedFiles,
        excludedPaths,
      );

      if (errors.length === 0) {
        console.log(
          chalk.green(
            "✅ Все имена файлов и папок соответствуют camelCase правилам!",
          ),
        );
        process.exit(0);
      } else {
        console.log(chalk.red("\n❌ Найдены нарушения camelCase правил:\n"));
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
}

main();
