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

import type {
  FullTestId,
  TestId,
  TestSubId,
} from "../../src/components/utilities/testable.ts";
import { type AddressMeaning, PAGE_TYPES } from "../../utilities/addresses.ts";
import {
  buildTestableSelector,
  buildTestableSubSelector,
  destructureFullTestId,
} from "../utilities/buildTestableSelector.ts";
import {
  getDeviceProfile,
  getDeviceProfileName,
} from "../utilities/discoverDevice.ts";
import { getTimeoutOrCancelItIfDebugging } from "../utilities/getTimeoutOrCancelItIfDebugging.ts";
import { createScreenshotPath } from "../utilities/screenshot.ts";
import {
  createVideoPath,
  renameFailedRemovePassedVideo,
  VIDEOS_FOLDER,
} from "../utilities/video.ts";

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
    this.context = await browser.newContext({
      ...getDeviceProfile(),
      recordVideo: {
        dir: VIDEOS_FOLDER,
      },
    });
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

    if (testSubId == null) return elementWithRequiredId;

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

const MORE_THAN_IN_PLAYWRIGHT = getTimeoutOrCancelItIfDebugging(6000);
setDefaultTimeout(MORE_THAN_IN_PLAYWRIGHT);
setWorldConstructor(ComplexWorld);

export const persistentAccounting = {
  searchPagesTypes: createAccountedTesting(false),
};

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: !isVisible(),
  });

  persistentAccounting.searchPagesTypes = createAccountedTesting(false);
});

Before(async function (this: ComplexWorld) {
  await this.setContextAndPage();
  this.accounting.elements.clearTestIds();
});

After(async function (this: ComplexWorld, scenario: ITestCaseHookParameter) {
  let failedVideoPath = "";

  if (scenario.result?.status === "FAILED") {
    const scenarioName = scenario.pickle.name;
    const deviceSuffix = getDeviceProfileName();
    const screenshotPath = createScreenshotPath(scenarioName, deviceSuffix);

    try {
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`\nScreenshot saved to: ${screenshotPath}`);
    } catch (error) {
      console.error(`\nFailed to take screenshot: ${error}`);
    }

    // For failed tests, we'll keep the video.
    // Set the target video path for renaming after context close.
    // Playwright doesn't allow to rename video files, so we'll do it manually.
    failedVideoPath = createVideoPath(scenarioName, deviceSuffix);

    console.log(`\nVideo will be saved to: ${failedVideoPath}`);
  }

  isVisible() || (await this.context.close());

  await renameFailedRemovePassedVideo(failedVideoPath);
});

AfterAll({ timeout: 60000 }, async function () {
  if (persistentAccounting.searchPagesTypes.active) {
    expect(persistentAccounting.searchPagesTypes.getTestIds()).toEqual(
      PAGE_TYPES,
    );
  }

  isVisible() || (await browser.close());
});

function isVisible() {
  return process.env.BROWSER_VISIBLE === "1";
}
