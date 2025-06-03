import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { ITEMS_LIMIT } from "../../../configuration.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import {
  CONTEXT_MENU_TEST_IDS,
  type ContextMenuMeaning,
} from "../../myLists/testIds.ts";
import {
  ADD_ITEM_ABOVE_MENUITEM,
  ADD_ITEM_BELOW_MENUITEM,
  LIST_ITEM,
  LIST_ITEM_INPUT,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
} from "../../testIds.ts";
import { TEST_SUB_ID_ATTRIBUTE } from "../../utilities/buildTestableSelector.ts";
import { getTimeoutOrCancelItIfDebugging } from "../../utilities/getTimeoutOrCancelItIfDebugging.ts";
import { calculateCurrentItemsCount } from "../utilities/calculateCurrentItemsCount.ts";
import { getRandomInt } from "../utilities/getRandomInt.ts";

Then(
  "I expect to see the fully visible {string} context menu",
  async function (this: ComplexWorld, contextMenuMeaning: ContextMenuMeaning) {
    await this.expectLocated(
      CONTEXT_MENU_TEST_IDS[contextMenuMeaning],
    ).toBeInViewport({ ratio: 1 });
  },
);

When("I hover the last added item input", async function (this: ComplexWorld) {
  const lastItemInput = this.locateByIdParts(LIST_ITEM_INPUT).last();

  await lastItemInput.hover();

  this.numbers.lastItemIndex = parseInt(
    (await lastItemInput.getAttribute(TEST_SUB_ID_ATTRIBUTE)) || "-1",
  );
});

Then("I expect to see the new last item", async function (this: ComplexWorld) {
  const lastItemInputIndex = parseInt(
    (await this.locateByIdParts(LIST_ITEM_INPUT)
      .last()
      .getAttribute(TEST_SUB_ID_ATTRIBUTE)) || "-1",
  );

  expect(lastItemInputIndex).toBe((this.numbers.lastItemIndex || 0) + 1);
});

When(
  "I add list items to their limit via adding above and below",
  { timeout: getTimeoutOrCancelItIfDebugging(60000) },
  async function (this: ComplexWorld) {
    for (let i = await calculateCurrentItemsCount(this); i < ITEMS_LIMIT; i++) {
      await this.locateByIdParts(LIST_ITEM).nth(getRandomInt(i)).hover();
      await this.locateVisible(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON).click();

      if (i % 2 === 0) {
        await this.locateVisible(ADD_ITEM_ABOVE_MENUITEM).click();
      } else {
        await this.locateVisible(ADD_ITEM_BELOW_MENUITEM).click();
      }
    }
  },
);

When("I focus some list item input", async function (this: ComplexWorld) {
  await this.locateByIdParts(LIST_ITEM_INPUT)
    .nth(getRandomInt(await this.locateByIdParts(LIST_ITEM_INPUT).count()))
    .focus();
});
