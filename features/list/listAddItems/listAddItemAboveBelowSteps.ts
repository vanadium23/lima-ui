import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import {
  CONTEXT_MENU_TEST_IDS,
  type ContextMenuMeaning,
} from "../../myLists/testIds.ts";
import { LIST_ITEM_INPUT } from "../../testIds.ts";
import { TEST_SUB_ID_ATTRIBUTE } from "../../utilities/buildTestableSelector.ts";

Then(
  "I expect to see the fully visible {string} context menu",
  async function (this: ComplexWorld, contextMenuMeaning: ContextMenuMeaning) {
    await this.expectLocated(
      CONTEXT_MENU_TEST_IDS[contextMenuMeaning],
    ).toBeInViewport({ ratio: 1 });
  },
);

When("I hover the last added item input", async function (this: ComplexWorld) {
  const lastItemInput = this.locate(LIST_ITEM_INPUT).last();

  await lastItemInput.hover();

  this.numbers.lastItemIndex = parseInt(
    (await lastItemInput.getAttribute(TEST_SUB_ID_ATTRIBUTE)) || "-1",
  );
});

Then("I expect to see the new last item", async function (this: ComplexWorld) {
  const lastItemInputIndex = parseInt(
    (await this.locate(LIST_ITEM_INPUT)
      .last()
      .getAttribute(TEST_SUB_ID_ATTRIBUTE)) || "-1",
  );

  expect(lastItemInputIndex).toBe((this.numbers.lastItemIndex || 0) + 1);
});
