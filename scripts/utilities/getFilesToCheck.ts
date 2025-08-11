import { relative } from "path";

const NODE_AND_SCRIPT = 2;

export function getFilesToCheck() {
  function removeArg(arg: string) {
    return !arg.startsWith("--");
  }

  function clipPath(path: string) {
    return relative(process.cwd(), path).replace(/\\/g, "/");
  }

  return process.argv.slice(NODE_AND_SCRIPT).filter(removeArg).map(clipPath);
}
