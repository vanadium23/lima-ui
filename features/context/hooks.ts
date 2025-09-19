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
import { type Browser, type BrowserContext, chromium, expect, type Page } from "@playwright/test";
import chalk from "chalk";

import type { FullTestId, TestId, TestSubId } from "../../src/components/utilities/testable.ts";
import { type AddressMeaning, PAGE_TYPES } from "../../utilities/addresses.ts";
import {
  buildTestableSelector,
  buildTestableSubSelector,
  destructureFullTestId,
} from "../utilities/buildTestableSelector.ts";
import { getDeviceProfile, getDeviceProfileName } from "../utilities/discoverDevice.ts";
import { getTimeoutOrCancelItIfDebugging } from "../utilities/getTimeoutOrCancelItIfDebugging.ts";
import { createTracePath } from "../utilities/traces.ts";

import { type AccountedTesting, createAccountedTesting } from "./createAccountedTesting.ts";

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
  itemsValues: string[] = [];
  responsesToWait: Partial<Record<AddressMeaning, ReturnType<Page["waitForResponse"]>>> = {};

  FRONTEND_ADDRESS = "http://localhost:4321";
  BACKEND_ADDRESS = "http://localhost:3000";

  constructor(options: IWorldOptions<ComplexWorldParameters>) {
    super(options);
  }

  async setContextAndPage() {
    this.context = await browser.newContext({
      ...getDeviceProfile(),
    });
    this.page = await this.context.newPage();

    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });
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
    const elementWithRequiredId = this.page.locator(buildTestableSelector(testId));

    if (testSubId == null) return elementWithRequiredId;

    const elementWithRequiredSubId = this.page.locator(buildTestableSubSelector(testSubId));

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

export const pagesAccounting: Record<string, AccountedTesting> = {};

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: !isVisible(),
  });
});

Before(async function (this: ComplexWorld) {
  await this.setContextAndPage();
  this.accounting.elements.clearTestIds();
});

After({ timeout: 60000 }, async function (this: ComplexWorld, scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === "FAILED") {
    const tracePath = createTracePath(scenario.pickle.name, getDeviceProfileName());

    try {
      await this.context.tracing.stop({ path: tracePath });

      console.log("\nПоказать трассировку:");
      console.log(chalk.cyan("▶️  npx playwright show-trace " + tracePath));
    } catch (error) {
      console.error(`\nОшибка сохранения трассировки: ${error}`);
    }
  } else {
    try {
      await this.context.tracing.stop();
    } catch (error) {
      console.error(`\nОшибка игнорирования трассировки: ${error}`);
    }
  }

  isVisible() || (await this.context.close());
});

AfterAll({ timeout: 60000 }, async function () {
  for (const accountedPagesSet of Object.values(pagesAccounting)) {
    expect(accountedPagesSet.getTestIds()).toEqual(PAGE_TYPES);
  }

  isVisible() || (await browser.close());
});

function isVisible() {
  return process.env.BROWSER_VISIBLE === "1";
}
