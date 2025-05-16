import type { Locator } from "@playwright/test";

import { DRAGGED_LIST_ITEM_INPUT, LIST_ITEM_INPUT } from "../../testIds.ts";
import { buildTestableSelector } from "../../utilities/buildTestableSelector.ts";

export async function getListItemValue(listItem: Locator) {
  let inputLocator = listItem.locator(buildTestableSelector(LIST_ITEM_INPUT));

  if ((await inputLocator.count()) === 0) {
    inputLocator = listItem.locator(
      buildTestableSelector(DRAGGED_LIST_ITEM_INPUT),
    );
  }

  return await inputLocator.inputValue();
}
