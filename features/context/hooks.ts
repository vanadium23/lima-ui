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
import type { TestId } from "../testIds.ts";
import { buildTestSelector } from "../utilities/buildTestSelector.ts";

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

  locate(testId: string) {
    return this.page.locator(buildTestSelector(testId));
  }

  locateAllTestable() {
    return this.page.locator(buildTestSelector());
  }

  expectLocated(testId: TestId) {
    return expect(this.locate(testId));
  }
}

setWorldConstructor(ComplexWorld);

BeforeAll(async function () {
  browser = await firefox.launch();
});

Before(async function (this: ComplexWorld) {
  await this.setPage();
  this.accounting.clearTestIds();
});

AfterAll(async function () {
  await browser.close();
});
