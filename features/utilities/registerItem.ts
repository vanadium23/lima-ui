import type { Locator } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import { LIST_ITEM, LIST_ITEM_INPUT } from "../testIds.ts";

import { TEST_SUB_ID_ATTRIBUTE } from "./buildTestableSelector.ts";

export async function registerItem(this: ComplexWorld, itemInput: Locator) {
  const itemInputTestSubId = await itemInput.getAttribute(
    TEST_SUB_ID_ATTRIBUTE,
  );
  this.accounting.registerTestIdAndSubId(LIST_ITEM_INPUT, itemInputTestSubId);
  this.accounting.registerTestIdAndSubId(LIST_ITEM, itemInputTestSubId);
}
