import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import { CHECKBOX, ITEM_INPUT_CONTAINER } from "../testIds.ts";
import {
  SWITCH_TEST_IDS,
  type SwitchMeaning,
} from "../listCreation/testIds.ts";
import { buildTestableSelector } from "../utilities/buildTestableSelector.ts";

Then(
  "I expect clipboard to contain items content",
  async function (this: ComplexWorld) {
    const expectedText = ["first item", "second item", "third item"]
      .map((item) => this.data[item] + "\n" || "")
      .join("");

    const clipboardContent = await this.page.evaluate(() =>
      navigator.clipboard.readText(),
    );

    expect(clipboardContent).toEqual(expectedText);
  },
);

When(
  "I press the {string} switch",
  async function (this: ComplexWorld, switchMeaning: SwitchMeaning) {
    const switchElement = this.locate(
      this.accounting.registerTestId(SWITCH_TEST_IDS[switchMeaning]),
    );

    await switchElement.click();
  },
);

Then(
  "I expect to see checkboxes for all list items",
  async function (this: ComplexWorld) {
    const itemInputs = this.locate(ITEM_INPUT_CONTAINER);

    for (const itemInput of await itemInputs.all()) {
      const checkbox = itemInput.locator(buildTestableSelector(CHECKBOX));
      await expect(checkbox).toBeInViewport();
    }
  },
);
