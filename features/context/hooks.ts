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
import { execSync } from "child_process";

import type { FullTestId, TestId, TestSubId } from "../../src/components/utilities/testable.ts";
import { type AddressMeaning, PAGE_TYPES, URL_AUTH } from "../../utilities/addresses.ts";
import { LOGIN_EMAIL_INPUT, LOGIN_PASS_INPUT, LOGIN_SUBMIT_BUTTON } from "../testIds.ts";
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

const DEFAULT_USER_EMAIL = "testBot@lima.ooo";
const DEFAULT_USER_PASSWORD = "devTestBot0";

type ComplexWorldParameters = Record<string, never>;

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

  FRONTEND_ADDRESS = process.env.CLIENT_ADDRESS || "http://localhost:4321";
  BACKEND_ADDRESS = process.env.PUBLIC_API_URL || "http://localhost:3000";

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
    const response = await fetch(`${this.BACKEND_ADDRESS}${address}`, {
      method,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return response;
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

  async loginAsDefaultUser() {
    await this.navigate(URL_AUTH);

    await this.locateByIdParts(LOGIN_EMAIL_INPUT).fill(DEFAULT_USER_EMAIL);
    await this.locateByIdParts(LOGIN_PASS_INPUT).fill(DEFAULT_USER_PASSWORD);
    await this.locateByIdParts(LOGIN_SUBMIT_BUTTON).click();

    await this.page.waitForURL((url) => !url.pathname.includes(URL_AUTH));
  }
}

const MORE_THAN_IN_PLAYWRIGHT = getTimeoutOrCancelItIfDebugging(6000);
setDefaultTimeout(MORE_THAN_IN_PLAYWRIGHT);
setWorldConstructor(ComplexWorld);

export const pagesAccounting: Record<string, AccountedTesting> = {};

BeforeAll({ timeout: 240000 }, async function () {
  try {
    browser = await getRunningChromium();
  } catch (noBrowsersError) {
    const errorMessage = noBrowsersError instanceof Error ? noBrowsersError.message : String(noBrowsersError);

    if (errorMessage.includes("Executable doesn't exist") || errorMessage.includes("npx playwright install")) {
      console.log(chalk.yellow("\n⚠️  Playwright browsers not found. Installing..."));

      try {
        execSync("npx playwright install", {
          stdio: "inherit",
          timeout: 120000,
        });

        console.log(chalk.green("\n✅ Playwright browsers installed successfully. Retrying browser launch..."));

        browser = await getRunningChromium();
      } catch (installationError) {
        console.error(chalk.red("\n❌ Failed to install Playwright browsers:"), installationError);
        throw installationError;
      }
    } else {
      throw noBrowsersError;
    }
  }
});

async function getRunningChromium() {
  return await chromium.launch({
    headless: !isVisible(),
  });
}

Before({ timeout: 15000 }, async function (this: ComplexWorld, scenario: ITestCaseHookParameter) {
  await this.setContextAndPage();
  this.accounting.elements.clearTestIds();

  const skipAuth = scenario.pickle.tags.some((tag) => tag.name === "@noAuth");

  if (!skipAuth) {
    await this.loginAsDefaultUser();
  }
});

After({ timeout: 60000 }, async function (this: ComplexWorld, scenario: ITestCaseHookParameter) {
  const hasTraceTag = scenario.pickle.tags.some((tag) => tag.name === "@trace");
  const shouldSaveTrace = hasTraceTag || scenario.result?.status === "FAILED";

  if (shouldSaveTrace) {
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

  void (isVisible() || (await this.context.close()));
});

AfterAll({ timeout: 60000 }, async function () {
  for (const accountedPagesSet of Object.values(pagesAccounting)) {
    expect(accountedPagesSet.getTestIds()).toEqual(PAGE_TYPES);
  }

  void (isVisible() || (await browser.close()));
});

function isVisible() {
  return process.env.BROWSER_VISIBLE === "1";
}
