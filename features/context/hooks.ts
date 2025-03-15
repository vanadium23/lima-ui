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
  expect,
  firefox,
  type Page,
} from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

import type {
  FullTestId,
  TestId,
  TestSubId,
} from "../../src/components/utilities/testable.ts";
import type { AddressMeaning } from "../../utilities/addresses.ts";
import {
  buildFullTestId,
  buildTestableSelector,
  buildTestableSubSelector,
  destructureFullTestId,
} from "../utilities/buildTestableSelector.ts";

import { accountedTesting } from "./accountedTesting.ts";

let browser: Browser;

interface ComplexWorldParameters { }

export class ComplexWorld extends World<ComplexWorldParameters> {
  context!: BrowserContext;
  page!: Page;
  accounting = accountedTesting;
  data: Record<string, string> = {};
  numbers: Record<string, number> = {};
  listIds: TestId[] = [];
  responsesToWait: Partial<
    Record<AddressMeaning, ReturnType<Page["waitForResponse"]>>
  > = {};

  FRONTEND_ADDRESS = "http://localhost:4321";
  BACKEND_ADDRESS = "http://localhost:3000";

  constructor(options: IWorldOptions<ComplexWorldParameters>) {
    super(options);
  }

  async setContextAndPage() {
    this.context = await browser.newContext();
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

  locate(testId: TestId, testSubId?: TestSubId) {
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
    return this.locate(testId, testSubId).locator("visible=true");
  }

  locateByFullId(fullTestId: FullTestId) {
    const { testId, testSubId } = destructureFullTestId(fullTestId);

    if (testSubId) return this.locate(testId, testSubId);

    return this.locate(testId);
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

  expectLocatedByIdParts(testId: TestId, testSubId: TestSubId) {
    return this.expectLocated(buildFullTestId(testId, testSubId));
  }
}

const MORE_THAN_IN_PLAYWRIGHT = 6000;
setDefaultTimeout(MORE_THAN_IN_PLAYWRIGHT);
setWorldConstructor(ComplexWorld);

const debugging = false; // HINT DEBUGGING

BeforeAll(async function () {
  const BROWSER_OPTIONS = { headless: !debugging };

  browser = await firefox.launch(BROWSER_OPTIONS);
});

Before(async function (this: ComplexWorld) {
  await this.setContextAndPage();
  this.accounting.clearTestIds();
});

const screenshotsDir = path.join(process.cwd(), "features", "screenshots");

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Take screenshot when a test fails - this needs to run BEFORE closing the page
After(async function (this: ComplexWorld, scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === "FAILED") {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, "_");
    const screenshotPath = path.join(screenshotsDir, `${scenarioName}_${timestamp}.png`);

    try {
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot saved to: ${screenshotPath}`);
    } catch (error) {
      console.error(`Failed to take screenshot: ${error}`);
    }
  }
});

// This After hook should run AFTER the screenshot hook
After("@last", async function (this: ComplexWorld) {
  debugging || (await this.context.close());
});

AfterAll(async function () {
  debugging || (await browser.close());
});
