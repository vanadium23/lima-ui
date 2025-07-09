import { Then } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { takeScreenshot } from "../utilities/screenshot.ts";

/**
 * Example step to manually take a screenshot at any point in a test
 * Usage in feature file: Then I take a screenshot named "my-custom-screenshot"
 */
Then(
  "I take a screenshot named {string}",
  async function (this: ComplexWorld, screenshotName: string) {
    await takeScreenshot(this, screenshotName);
  },
);

/**
 * Example step to take a screenshot without a custom name
 * Usage in feature file: Then I take a screenshot
 */
Then("I take a screenshot", async function (this: ComplexWorld) {
  await takeScreenshot(this);
});
