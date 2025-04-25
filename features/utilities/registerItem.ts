import type { Locator } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import {
  AUTO_LIST_ITEM_INPUT,
  extractListItemTestIdFromItsInputTestId,
} from "../testIds.ts";

import {
  TEST_ID_ATTRIBUTE,
  TEST_SUB_ID_ATTRIBUTE,
} from "./buildTestableSelector.ts";

export async function registerItem(this: ComplexWorld, itemInput: Locator) {
  const itemInputTestSubId = await itemInput.getAttribute(
    TEST_SUB_ID_ATTRIBUTE,
  );
  const itemInputTestId =
    (await itemInput.getAttribute(TEST_ID_ATTRIBUTE)) || "";

  if (itemInputTestId === AUTO_LIST_ITEM_INPUT) {
    this.accounting.itemAdders.registerTestId(itemInputTestId);
  }

  this.accounting.elements.registerTestIdAndSubId(
    itemInputTestId,
    itemInputTestSubId,
  );
  this.accounting.elements.registerTestIdAndSubId(
    extractListItemTestIdFromItsInputTestId(itemInputTestId),
    itemInputTestSubId,
  );
}
