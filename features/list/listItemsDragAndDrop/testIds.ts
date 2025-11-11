import type { TestId } from "../../../src/components/utilities/testable.ts";
import { AUTO_LIST_ITEM, DRAG_HANDLE, LIST_ITEM, OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON } from "../../testIds.ts";
import { buildFullTestId } from "../../utilities/buildTestableSelector.ts";

export const LIST_ITEM_TEST_IDS = {
  first: buildFullTestId(LIST_ITEM, 0),
  second: buildFullTestId(LIST_ITEM, 1),
  third: buildFullTestId(LIST_ITEM, 2),
  fourth: buildFullTestId(LIST_ITEM, 3),
  fifth: buildFullTestId(LIST_ITEM, 4),
  sixth: buildFullTestId(LIST_ITEM, 5),
  seventh: buildFullTestId(LIST_ITEM, 6),
  eighth: buildFullTestId(LIST_ITEM, 7),
  ninth: buildFullTestId(LIST_ITEM, 8),
  automatic: buildFullTestId(AUTO_LIST_ITEM, AUTO_LIST_ITEM),
  "new automatic": buildFullTestId(AUTO_LIST_ITEM, AUTO_LIST_ITEM),
  "old automatic": buildFullTestId(AUTO_LIST_ITEM, AUTO_LIST_ITEM),
  last: LIST_ITEM,
};
export type ListItemMeaning = keyof typeof LIST_ITEM_TEST_IDS;

export const DRAG_HANDLE_TEST_IDS: Record<ListItemMeaning, TestId> = {
  first: buildFullTestId(DRAG_HANDLE, 0),
  second: buildFullTestId(DRAG_HANDLE, 1),
  third: buildFullTestId(DRAG_HANDLE, 2),
  fourth: buildFullTestId(DRAG_HANDLE, 3),
  fifth: buildFullTestId(DRAG_HANDLE, 4),
  sixth: buildFullTestId(DRAG_HANDLE, 5),
  seventh: buildFullTestId(DRAG_HANDLE, 6),
  eighth: buildFullTestId(DRAG_HANDLE, 7),
  ninth: buildFullTestId(DRAG_HANDLE, 8),
  automatic: buildFullTestId(DRAG_HANDLE, AUTO_LIST_ITEM),
  "new automatic": buildFullTestId(DRAG_HANDLE, AUTO_LIST_ITEM),
  "old automatic": buildFullTestId(DRAG_HANDLE, AUTO_LIST_ITEM),
  last: DRAG_HANDLE,
};

export const OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON_TEST_IDS: Record<ListItemMeaning, TestId> = {
  first: buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 0),
  second: buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 1),
  third: buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 2),
  fourth: buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 3),
  fifth: buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 4),
  sixth: buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 5),
  seventh: buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 6),
  eighth: buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 7),
  ninth: buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 8),
  automatic: buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, AUTO_LIST_ITEM),
  "new automatic": buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, AUTO_LIST_ITEM),
  "old automatic": buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, AUTO_LIST_ITEM),
  last: OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
};
