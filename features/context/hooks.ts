import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  type IWorldOptions,
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
import { accountedTesting } from "./accountedTesting.ts";
import {
  buildTestableSelector,
  buildTestableSubSelector,
  destructureFullTestId,
} from "../utilities/buildTestableSelector.ts";
import type {
  FullTestId,
  TestId,
  TestSubId,
} from "../../src/components/utilities/testable.ts";

let browser: Browser;

interface ComplexWorldParameters {}

export class ComplexWorld extends World<ComplexWorldParameters> {
  context!: BrowserContext;
  page!: Page;
  accounting = accountedTesting;
  data: Record<string, string> = {};
  counters: Record<string, number> = {};

  constructor(options: IWorldOptions<ComplexWorldParameters>) {
    super(options);
  }

  async setContextAndPage() {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
  }

  async navigate(address: string) {
    await this.page.goto(`http://localhost:4321/${address}`);
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
}

setWorldConstructor(ComplexWorld);

const debugging = false;

BeforeAll(async function () {
  const BROWSER_OPTIONS = { headless: !debugging };

  browser = await firefox.launch(BROWSER_OPTIONS);
});

Before(async function (this: ComplexWorld) {
  await this.setContextAndPage();
  this.accounting.clearTestIds();
});

After(async function (this: ComplexWorld) {
  debugging || (await this.context.close());
});

AfterAll(async function () {
  debugging || (await browser.close());
});
