import * as fs from "fs";
import * as path from "path";

import type {ComplexWorld} from "../context/hooks";

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
  const screenshotsDir = path.join(process.cwd(), "features", "screenshots");

  if (!fs.existsSync(screenshotsDir)) {
    throw new Error("Screenshots directory does not exist");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const screenshotName = name
    ? `${name.replace(/[^a-zA-Z0-9]/g, "_")}_${timestamp}.png`
    : `manual_screenshot_${timestamp}.png`;

  const screenshotPath = path.join(screenshotsDir, screenshotName);

  try {
    await world.page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    return screenshotPath;
  } catch (error) {
    console.error(`Failed to take screenshot: ${error}`);
    throw error;
  }
}
