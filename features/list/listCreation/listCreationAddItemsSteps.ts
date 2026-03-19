import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { ITEMS_LIMIT } from "../../../configuration.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import {
  ITEMS_LIMIT_REACHED_WARNING,
  LIST_ITEM_INPUT,
  LIST_ITEMS,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
} from "../../testIds.ts";
import { noVerticalScroll } from "../../utilities/checkScroll.ts";
import { getTimeoutOrCancelItIfDebugging } from "../../utilities/getTimeoutOrCancelItIfDebugging.ts";
import { calculateCurrentItemsCount } from "../utilities/calculateCurrentItemsCount.ts";

When("I add list items till scroll appears plus one item input", async function (this: ComplexWorld) {
  const addItemButton = this.locateByIdParts(TOOLS_PANEL_ADD_ITEM_BUTTON);
  const itemsInputs = this.locateByIdParts(LIST_ITEMS);

  while ((await itemsInputs.evaluate(noVerticalScroll)) && (await addItemButton.isEnabled())) {
    await addItemButton.click();
  }

  if (await addItemButton.isEnabled()) {
    await addItemButton.click();
  }
});

Then("I expect to see the last added item input", async function (this: ComplexWorld) {
  await expect(this.locateByIdParts(LIST_ITEM_INPUT).last()).toBeInViewport();
});

Then("I expect not to see the first item input", async function () {
  await expect(this.locateByIdParts(LIST_ITEM_INPUT).first()).not.toBeInViewport();
});

When(
  "I add list items to their limit",
  { timeout: getTimeoutOrCancelItIfDebugging(90000) },
  async function (this: ComplexWorld) {
    await addSeveralItems(this, ITEMS_LIMIT);
  },
);

When(
  "I add list items to one below their limit",
  { timeout: getTimeoutOrCancelItIfDebugging(90000) },
  async function (this: ComplexWorld) {
    await addSeveralItems(this, ITEMS_LIMIT - 1);
  },
);

async function addSeveralItems(complexWorld: ComplexWorld, itemsCount: number) {
  const addItemButton = complexWorld.locateByIdParts(TOOLS_PANEL_ADD_ITEM_BUTTON);

  for (let i = await calculateCurrentItemsCount(complexWorld); i < itemsCount; i++) {
    await addItemButton.click();
  }
}

Then("I expect to see the warning about items inputs limit reached", async function (this: ComplexWorld) {
  await this.expectLocated(ITEMS_LIMIT_REACHED_WARNING).toBeInViewport();
});

When(
  "I fill all items inputs with their index",
  { timeout: getTimeoutOrCancelItIfDebugging(90000) },
  async function (this: ComplexWorld) {
    const itemInputs = this.locateByIdParts(LIST_ITEM_INPUT);
    const count = await itemInputs.count();

    for (let i = 0; i < count; i++) {
      const input = itemInputs.nth(i);
      await input.fill(`Item ${i + 1}`);
    }
  },
);
