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
  buildFullTestId,
  buildTestableSelector,
  buildTestableSubSelector,
  destructureFullTestId,
} from "../utilities/buildTestableSelector.ts";
import type {
  FullTestId,
  TestId,
  TestSubId,
} from "../../src/components/utilities/testable.ts";
import type { AddressMeaning } from "../utilities/addresses.ts";

let browser: Browser;

interface ComplexWorldParameters {}

export class ComplexWorld extends World<ComplexWorldParameters> {
  context!: BrowserContext;
  page!: Page;
  accounting = accountedTesting;
  data: Record<string, string> = {};
  counters: Record<string, number> = {};
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
    await this.page.goto(`${this.FRONTEND_ADDRESS}/${address}`);
  }

  async request(address: string, method: string) {
    return fetch(`${this.BACKEND_ADDRESS}/${address}`, {
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

After(async function (this: ComplexWorld) {
  debugging || (await this.context.close());
});

AfterAll(async function () {
  debugging || (await browser.close());
});
