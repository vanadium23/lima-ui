import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  type ITestCaseHookParameter,
  type IWorldOptions,
  setDefaultTimeout,
  setWorldConstructor,
  World,
} from "@cucumber/cucumber";
import {
  type Browser,
  type BrowserContext,
  chromium,
  expect,
  type Page,
} from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import {
  DEVICE_PROFILES,
  DeviceProfiles,
  isDeviceProfile as isDeviceProfileName,
} from "../config/deviceProfiles.ts";

import type {
  FullTestId,
  TestId,
  TestSubId,
} from "../../src/components/utilities/testable.ts";
import type { AddressMeaning } from "../../utilities/addresses.ts";
import {
  buildTestableSelector,
  buildTestableSubSelector,
  destructureFullTestId,
} from "../utilities/buildTestableSelector.ts";

import { getTimeoutOrCancelItIfDebugging } from "../utilities/getTimeoutOrCancelItIfDebugging.ts";
import { createAccountedTesting } from "./createAccountedTesting.ts";

let browser: Browser;

interface ComplexWorldParameters {}

export class ComplexWorld extends World<ComplexWorldParameters> {
  context!: BrowserContext;
  page!: Page;
  accounting = {
    elements: createAccountedTesting(),
    itemAdders: createAccountedTesting(),
  };
  data: Record<string, string> = {};
  oldData: Record<string, string> = {};
  numbers: Record<string, number> = {};
  listIds: TestId[] = [];
  itemsValues: string[] = [];
  responsesToWait: Partial<
    Record<AddressMeaning, ReturnType<Page["waitForResponse"]>>
  > = {};

  FRONTEND_ADDRESS = "http://localhost:4321";
  BACKEND_ADDRESS = "http://localhost:3000";

  constructor(options: IWorldOptions<ComplexWorldParameters>) {
    super(options);
  }

  async setContextAndPage() {
    this.context = await browser.newContext(getDeviceProfile());
    this.page = await this.context.newPage();
  }

  async navigate(address: string) {
    await this.page.goto(`${this.FRONTEND_ADDRESS}${address}`);
  }

  async request(address: string, method: string) {
    return fetch(`${this.BACKEND_ADDRESS}${address}`, {
      method,
    });
  }

  locateByIdParts(testId: TestId, testSubId?: TestSubId) {
    const elementWithRequiredId = this.page.locator(
      buildTestableSelector(testId),
    );

    if (!testSubId) return elementWithRequiredId;

    const elementWithRequiredSubId = this.page.locator(
      buildTestableSubSelector(testSubId),
    );

    return elementWithRequiredId.and(elementWithRequiredSubId);
  }

  locateVisible(testId: TestId, testSubId?: TestSubId) {
    return this.locateByIdParts(testId, testSubId).locator("visible=true");
  }

  locateByFullId(fullTestId: FullTestId) {
    const { testId, testSubId } = destructureFullTestId(fullTestId);

    if (testSubId) return this.locateByIdParts(testId, testSubId);

    return this.locateByIdParts(testId);
  }

  locateAllTestable() {
    return this.page.locator(buildTestableSelector());
  }

  expectLocated(fullTestId: FullTestId) {
    return expect(this.locateByFullId(fullTestId));
  }

  expectLocatedVisible(fullTestId: FullTestId) {
    return expect(this.locateVisible(fullTestId));
  }
}

const debugging = process.env.PWDEBUG === "1";

const MORE_THAN_IN_PLAYWRIGHT = getTimeoutOrCancelItIfDebugging(6000);
setDefaultTimeout(MORE_THAN_IN_PLAYWRIGHT);
setWorldConstructor(ComplexWorld);

const screenshotsFolder = path.join(process.cwd(), "features", "screenshots");

BeforeAll(async function () {
  prepareEmptyScreenshotsFolder();
  logDeviceInfo();

  browser = await chromium.launch();
});

Before(async function (this: ComplexWorld) {
  await this.setContextAndPage();
  this.accounting.elements.clearTestIds();
});

// Take screenshot when a test fails - this needs to run BEFORE closing the page
After(async function (this: ComplexWorld, scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === "FAILED") {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, "_");
    const deviceSuffix = getDeviceProfileName();
    const screenshotPath = path.join(
      screenshotsFolder,
      `${timestamp}_${scenarioName}${deviceSuffix}.png`,
    );

    try {
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`\nScreenshot saved to: ${screenshotPath}`);
    } catch (error) {
      console.error(`\nFailed to take screenshot: ${error}`);
    }
  }
});

// This After hook should run AFTER the screenshot hook
After("@last", async function (this: ComplexWorld) {
  debugging || (await this.context.close());
});

AfterAll({ timeout: 60000 }, async function () {
  debugging || (await browser.close());
});

function getDeviceProfile() {
  const deviceProfileName = getDeviceProfileName();

  if (isDeviceProfileName(deviceProfileName)) {
    return DEVICE_PROFILES[deviceProfileName];
  } else {
    return DEVICE_PROFILES.desktop;
  }
}

function getDeviceProfileName() {
  return process.env.DEVICE_PROFILE || DeviceProfiles.desktop;
}

function prepareEmptyScreenshotsFolder() {
  if (fs.existsSync(screenshotsFolder)) {
    const files = fs.readdirSync(screenshotsFolder);

    for (const file of files) {
      fs.unlinkSync(path.join(screenshotsFolder, file));
    }
    console.log(
      `\nCleared ${files.length} screenshots from: ${screenshotsFolder}`,
    );
  } else {
    fs.mkdirSync(screenshotsFolder, { recursive: true });
  }
}

/**
 * Logs detailed information about the test device in a formatted way
 */
function logDeviceInfo() {
  // ANSI escape codes for styling
  const reset = "\x1b[0m";
  const bold = "\x1b[1m";
  const cyan = "\x1b[36m";
  const bgBlue = "\x1b[44m";
  const dim = "\x1b[2m";

  const deviceProfile = getDeviceProfile();

  const header = `${bold}${bgBlue} TEST DEVICE: ${reset}`;
  const deviceHeader = `${bold}${cyan}${getDeviceProfileName().toUpperCase()}${reset}`;

  const deviceInfo = [
    `${dim}• Viewport:${reset} ${deviceProfile.viewport.width}x${deviceProfile.viewport.height}`,
    `${dim}• Mobile:${reset} ${deviceProfile.isMobile ? "Yes" : "No"}`,
    `${dim}• Touch:${reset} ${deviceProfile.hasTouch ? "Yes" : "No"}`,
    `${dim}• Pixel Ratio:${reset} ${deviceProfile.deviceScaleFactor}`,
  ].join("\n");

  // Add some spacing and a separator line
  console.log("\n" + "=".repeat(60));
  console.log(header, deviceHeader);
  console.log("\n");
  console.log(deviceInfo);
  console.log("=".repeat(60) + "\n");
}
