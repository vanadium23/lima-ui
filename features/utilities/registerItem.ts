import { ITEM_INPUT, ITEM_INPUT_CONTAINER } from "../testIds.ts";
import { TEST_SUB_ID_ATTRIBUTE } from "./buildTestableSelector.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import type { Locator } from "@playwright/test";

export async function registerItem(this: ComplexWorld, itemInput: Locator) {
    const itemInputTestSubId = await itemInput.getAttribute(
        TEST_SUB_ID_ATTRIBUTE,
      );
      this.accounting.registerTestIdAndSubId(ITEM_INPUT, itemInputTestSubId);
      this.accounting.registerTestIdAndSubId(
        ITEM_INPUT_CONTAINER,
        itemInputTestSubId,
      );
}
