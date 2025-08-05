// Получаем список файлов из аргументов командной строки (от lint-staged)
export function getFilesToCheck() {
  return process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
}
