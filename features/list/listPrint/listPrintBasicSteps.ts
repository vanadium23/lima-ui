import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import { PRINT_LIST_ERROR, PRINT_LIST_ITEM, PRINT_LIST_TITLE, TOOLS_PANEL_BUTTON_PRINT_LIST } from "../../testIds.ts";

import { PRINT_ELEMENT_TEST_IDS, type PrintElementMeaning } from "./testIds.ts";

When("I press the print list button and wait for the new tab with printing stub", async function (this: ComplexWorld) {
  await this.locateByIdParts(TOOLS_PANEL_BUTTON_PRINT_LIST).click();

  const newPage = await this.context.waitForEvent("page");

  // DOC Print dialog is not closable in Playwright. This is why we need to disable it.
  await newPage.evaluate("window.print = () => {}");

  await newPage.waitForLoadState("networkidle");

  this.page = newPage;
});

When("I press the print list button and wait for the new tab with error", async function (this: ComplexWorld) {
  const newPagePromise = this.context.waitForEvent("page");
  await this.locateByIdParts(TOOLS_PANEL_BUTTON_PRINT_LIST).click();
  const newPage = await newPagePromise;

  await newPage.evaluate("window.print = () => {}");

  const currentUrl = new URL(newPage.url());
  currentUrl.searchParams.set("error", "true");

  await newPage.goto(currentUrl.toString());
  await newPage.waitForLoadState("networkidle");

  this.page = newPage;
});

Then(
  "I expect to see the {string} text",
  async function (this: ComplexWorld, printElementMeaning: PrintElementMeaning) {
    const expectText = this.expectLocated(PRINT_ELEMENT_TEST_IDS[printElementMeaning]);

    await expectText.toBeInViewport();
    await expectText.toHaveText(this.data[printElementMeaning] || "");
  },
);

Then(
  "I expect not to see the {string} text",
  async function (this: ComplexWorld, printElementMeaning: PrintElementMeaning) {
    await this.expectLocated(PRINT_ELEMENT_TEST_IDS[printElementMeaning]).not.toBeInViewport();
  },
);

Then("I expect to see checkboxes for all list items on the print page", async function (this: ComplexWorld) {
  const listItems = this.locateByIdParts(PRINT_LIST_ITEM);

  expect(await listItems.count()).toBeGreaterThan(0);

  for (const item of await listItems.all()) {
    const hasCheckbox = await item.evaluate((itemElement) => {
      const bulletStyle = window.getComputedStyle(itemElement, "::before");

      return (
        bulletStyle.getPropertyValue("content") === '""' &&
        bulletStyle.getPropertyValue("border").includes("solid") &&
        bulletStyle.getPropertyValue("border").includes("1px")
      );
    });

    expect(hasCheckbox).toBe(true);
  }
});

When("I press the print list button and check for system print dialog", async function (this: ComplexWorld) {
  await this.locateByIdParts(TOOLS_PANEL_BUTTON_PRINT_LIST).click();

  const newPage = await this.context.waitForEvent("page");

  await newPage.waitForLoadState("networkidle");

  this.page = newPage;
});

Then("I expect the system print dialog to be triggered", async function (this: ComplexWorld) {
  await expect(async () => {
    // DOC Clicking on the body doesn't work as system dialog is shown.
    await this.page.locator(PRINT_LIST_TITLE).dblclick({ timeout: 1000 });
  }).not.toPass();
});

Then("I expect to see the print page error message", async function (this: ComplexWorld) {
  await this.expectLocated(PRINT_LIST_ERROR).toBeInViewport();
});
