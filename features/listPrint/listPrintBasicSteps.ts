import { Then, When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { TOOLS_BUTTON_PRINT_LIST } from "../testIds.ts";

import { PRINT_ELEMENT_TEST_IDS, type PrintElementMeaning } from "./testIds.ts";

When(
  "I press the print list button and wait for the new tab",
  async function (this: ComplexWorld) {
    // Wait for a new page to open when clicking the print button.
    const [newPage] = await Promise.all([
      this.context.waitForEvent("page"),
      this.locate(TOOLS_BUTTON_PRINT_LIST).click(),
    ]);

    // Print dialog is not closable in Playwright. This is why we need to disable it.
    newPage.evaluate("window.print = () => {}");

    await newPage.waitForLoadState("networkidle");

    this.page = newPage;
  },
);

Then(
  "I expect to see the {string} text",
  async function (
    this: ComplexWorld,
    printElementMeaning: PrintElementMeaning,
  ) {
    const expectText = this.expectLocated(
      PRINT_ELEMENT_TEST_IDS[printElementMeaning],
    );

    await expectText.toBeInViewport();
    await expectText.toHaveText(this.data[printElementMeaning] || "");
  },
);

Then(
  "I expect not to see the {string} text",
  async function (
    this: ComplexWorld,
    printElementMeaning: PrintElementMeaning,
  ) {
    await this.expectLocated(
      PRINT_ELEMENT_TEST_IDS[printElementMeaning],
    ).not.toBeInViewport();
  },
);
