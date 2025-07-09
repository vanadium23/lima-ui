import * as fs from "fs";
import * as path from "path";

import { RESULTS_FOLDER } from "../config/results.ts";
import type { ComplexWorld } from "../context/hooks.ts";

export const SCREENSHOTS_FOLDER = path.join(
  process.cwd(),
  ...RESULTS_FOLDER,
  "screenshots",
);

/**
 * Takes a screenshot and saves it to the screenshots directory
 * @param world The Cucumber world object
 * @param name Optional custom name for the screenshot
 * @returns The path to the saved screenshot
 */
export async function takeScreenshot(
  world: ComplexWorld,
  name?: string,
): Promise<string> {
  if (!fs.existsSync(SCREENSHOTS_FOLDER)) {
    throw new Error("Screenshots directory does not exist");
  }

  const screenshotPath = createScreenshotPath(name);

  try {
    await world.page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    return screenshotPath;
  } catch (error) {
    console.error(`Failed to take screenshot: ${error}`);
    throw error;
  }
}

/**
 * Creates a standardized path for a screenshot file
 * @param name Optional name for the screenshot (e.g., scenario name)
 * @param deviceSuffix Optional device suffix for the filename
 * @returns The full path where the screenshot should be saved
 */
export function createScreenshotPath(
  name?: string,
  deviceSuffix?: string,
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  let screenshotName: string;

  if (name) {
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_");
    screenshotName = deviceSuffix
      ? `${timestamp}_${sanitizedName}_${deviceSuffix}.png`
      : `${sanitizedName}_${timestamp}.png`;
  } else {
    screenshotName = `manual_screenshot_${timestamp}.png`;
  }

  return path.join(SCREENSHOTS_FOLDER, screenshotName);
}

export function prepareEmptyScreenshotsFolder(): void {
  if (fs.existsSync(SCREENSHOTS_FOLDER)) {
    for (const file of fs.readdirSync(SCREENSHOTS_FOLDER)) {
      fs.unlinkSync(path.join(SCREENSHOTS_FOLDER, file));
    }
  } else {
    fs.mkdirSync(SCREENSHOTS_FOLDER, { recursive: true });
  }
}
