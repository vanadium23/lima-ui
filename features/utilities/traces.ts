import * as fs from "fs";
import * as path from "path";

import { RESULTS_FOLDER } from "../config/results.ts";

function getTracesFolder(device: string) {
  return path.join(process.cwd(), ...RESULTS_FOLDER, "traces", device);
}

export function createTracePath(scenarioName: string, deviceSuffix: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const sanitizedName = scenarioName.replace(/[^a-zA-Z0-9]/g, "_");
  const traceName = `${sanitizedName}_${deviceSuffix}_${timestamp}.zip`;

  return path.join(getTracesFolder(deviceSuffix), traceName);
}

export function prepareEmptyTracesFolder(device: string): void {
  const tracesFolder = getTracesFolder(device);

  if (fs.existsSync(tracesFolder)) {
    for (const file of fs.readdirSync(tracesFolder)) {
      fs.unlinkSync(path.join(tracesFolder, file));
    }
  } else {
    fs.mkdirSync(tracesFolder, { recursive: true });
  }
}
