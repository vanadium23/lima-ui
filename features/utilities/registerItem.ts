import type { ComplexWorld } from "../context/hooks.ts";
import { type ItemInputMeaning, LIST_ITEM_INPUT_TEST_IDS } from "../list/listAddItems/testIds.ts";
import {
  DRAG_HANDLE_TEST_IDS,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON_TEST_IDS,
} from "../list/listItemsDragAndDrop/testIds.ts";
import { AUTO_LIST_ITEM_INPUT, extractListItemTestIdFromItsInputTestId } from "../testIds.ts";

import { destructureFullTestId } from "./buildTestableSelector.ts";
import { isMobile, isTablet } from "./discoverDevice.ts";

export async function registerItem(complexWorld: ComplexWorld, itemInputMeaning: ItemInputMeaning) {
  const itemInputFullTestId = LIST_ITEM_INPUT_TEST_IDS[itemInputMeaning];

  const { testId, testSubId } = destructureFullTestId(itemInputFullTestId);

  if (testId === AUTO_LIST_ITEM_INPUT) {
    complexWorld.accounting.itemAdders.registerTestId(itemInputFullTestId);
  }

  complexWorld.accounting.elements.registerTestIdAndSubId(testId, testSubId);
  complexWorld.accounting.elements.registerTestIdAndSubId(extractListItemTestIdFromItsInputTestId(testId), testSubId);

  if (isTablet() || isMobile()) {
    complexWorld.accounting.elements.registerTestId(DRAG_HANDLE_TEST_IDS[itemInputMeaning]);

    // DOC У автопункта нет выпадающего меню.
    if (["automatic", "new automatic", "old automatic"].includes(itemInputMeaning)) return;

    complexWorld.accounting.elements.registerTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON_TEST_IDS[itemInputMeaning]);
  }
}
