import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { ITEMS_LIMIT } from "../../configuration.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  ITEMS_LIMIT_REACHED_WARNING,
  LIST_ITEM,
  LIST_ITEM_INPUT,
  LIST_ITEMS,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
} from "../testIds.ts";
import { TEST_SUB_ID_ATTRIBUTE } from "../utilities/buildTestableSelector.ts";
import { noVerticalScroll } from "../utilities/checkScroll.ts";

Then(
  "I expect to see second item input ready for typing with the following placeholder: {string}",
  async function (this: ComplexWorld, placeholder: string) {
    const secondItemInput = this.locate(LIST_ITEM_INPUT).nth(1);

    const secondItemTestSubId = await secondItemInput.getAttribute(
      TEST_SUB_ID_ATTRIBUTE,
    );
    this.accounting.registerTestIdAndSubId(
      LIST_ITEM_INPUT,
      secondItemTestSubId,
    );
    this.accounting.registerTestIdAndSubId(LIST_ITEM, secondItemTestSubId);

    const expectSecondItemInput = expect(secondItemInput);

    await expectSecondItemInput.toBeInViewport();
    await expectSecondItemInput.toBeEnabled();
    await expectSecondItemInput.toHaveAttribute("placeholder", placeholder);
  },
);

When(
  "I add list items till scroll appears plus one item input",
  async function (this: ComplexWorld) {
    const addItemButton = this.locate(TOOLS_PANEL_ADD_ITEM_BUTTON);
    const itemsInputs = this.locate(LIST_ITEMS);

    while (
      (await itemsInputs.evaluate(noVerticalScroll)) &&
      (await addItemButton.isEnabled())
    ) {
      await addItemButton.click();
    }

    if (await addItemButton.isEnabled()) {
      await addItemButton.click();
    }
  },
);

Then(
  "I expect to see the last added item input",
  async function (this: ComplexWorld) {
    await expect(this.locate(LIST_ITEM_INPUT).last()).toBeInViewport();
  },
);

Then("I expect not to see the first item input", async function () {
  await expect(this.locate(LIST_ITEM_INPUT).first()).not.toBeInViewport();
});

When(
  "I add list items to their limit",
  { timeout: 60000 },
  async function (this: ComplexWorld) {
    const addItemButton = this.locate(TOOLS_PANEL_ADD_ITEM_BUTTON);

    const itemsInputs = this.locate(LIST_ITEM_INPUT);
    const currentItemCount = await itemsInputs.count();

    for (let i = currentItemCount; i < ITEMS_LIMIT; i++) {
      await addItemButton.click();
    }
  },
);

Then(
  "I expect to see the warning about items inputs limit reached",
  async function (this: ComplexWorld) {
    await this.expectLocated(ITEMS_LIMIT_REACHED_WARNING).toBeInViewport();
  },
);
