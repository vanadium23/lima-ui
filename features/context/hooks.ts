import {
  AfterAll,
  Before,
  BeforeAll,
  type IWorldOptions,
  setWorldConstructor,
  World,
} from "@cucumber/cucumber";
import { type Browser, expect, firefox, type Page } from "@playwright/test";
import { accountedTesting } from "./accountedTesting.ts";
import {
  buildTestableSelector,
  buildTestableSubSelector,
} from "../utilities/buildTestableSelector.ts";
import type {
  TestId,
  TestSubId,
} from "../../src/components/utilities/testable.ts";

let browser: Browser;

interface ComplexWorldParameters {}

export class ComplexWorld extends World<ComplexWorldParameters> {
  page!: Page;
  accounting = accountedTesting;

  constructor(options: IWorldOptions<ComplexWorldParameters>) {
    super(options);
  }

  async setPage() {
    this.page = await browser.newPage();
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

  locateAllTestable() {
    return this.page.locator(buildTestableSelector());
  }

  expectLocated(testId: TestId) {
    return expect(this.locate(testId));
  }
}

setWorldConstructor(ComplexWorld);

BeforeAll(async function () {
  const BROWSER_OPTIONS = { headless: true };

  browser = await firefox.launch(BROWSER_OPTIONS);
});

Before(async function (this: ComplexWorld) {
  await this.setPage();
  this.accounting.clearTestIds();
});

AfterAll(async function () {
  await browser.close();
});
