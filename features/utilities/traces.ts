import * as fs from "fs";
import * as path from "path";

import { RESULTS_FOLDER } from "../config/results.ts";

export const TRACES_FOLDER = path.join(process.cwd(), ...RESULTS_FOLDER, "traces");

export function createTracePath(scenarioName: string, deviceSuffix: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const sanitizedName = scenarioName.replace(/[^a-zA-Z0-9]/g, "_");
  const traceName = `${sanitizedName}_${deviceSuffix}_${timestamp}.zip`;

  return path.join(TRACES_FOLDER, traceName);
}

export function prepareEmptyTracesFolder(): void {
  if (fs.existsSync(TRACES_FOLDER)) {
    for (const file of fs.readdirSync(TRACES_FOLDER)) {
      fs.unlinkSync(path.join(TRACES_FOLDER, file));
    }
  } else {
    fs.mkdirSync(TRACES_FOLDER, { recursive: true });
  }
}
