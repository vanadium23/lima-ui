import type { TestId } from "../../../src/components/utilities/testable.ts";
import {
  ADD_ITEM_ABOVE_MENUITEM,
  ADD_ITEM_BELOW_MENUITEM,
  AUTO_LIST_ITEM,
  AUTO_LIST_ITEM_INPUT,
  LIST_ITEM,
  LIST_ITEM_INPUT,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
} from "../../testIds.ts";
import { buildFullTestId } from "../../utilities/buildTestableSelector.ts";
import type { ListItemMeaning } from "../listItemsDragAndDrop/testIds.ts";

export const LIST_ITEM_INPUT_TEST_IDS: Record<ListItemMeaning, TestId> = {
  first: buildFullTestId(LIST_ITEM_INPUT, 0),
  second: buildFullTestId(LIST_ITEM_INPUT, 1),
  third: buildFullTestId(LIST_ITEM_INPUT, 2),
  fourth: buildFullTestId(LIST_ITEM_INPUT, 3),
  fifth: buildFullTestId(LIST_ITEM_INPUT, 4),
  sixth: buildFullTestId(LIST_ITEM_INPUT, 5),
  seventh: buildFullTestId(LIST_ITEM_INPUT, 6),
  eighth: buildFullTestId(LIST_ITEM_INPUT, 7),
  ninth: buildFullTestId(LIST_ITEM_INPUT, 8),
  automatic: buildFullTestId(AUTO_LIST_ITEM_INPUT, AUTO_LIST_ITEM),
  "new automatic": buildFullTestId(AUTO_LIST_ITEM_INPUT, AUTO_LIST_ITEM),
  "old automatic": buildFullTestId(AUTO_LIST_ITEM_INPUT, AUTO_LIST_ITEM),
  last: LIST_ITEM,
};
export type ItemInputMeaning = keyof typeof LIST_ITEM_INPUT_TEST_IDS;

export const ITEM_ADDERS = [
  TOOLS_PANEL_ADD_ITEM_BUTTON,
  buildFullTestId(AUTO_LIST_ITEM_INPUT, AUTO_LIST_ITEM),
  ADD_ITEM_ABOVE_MENUITEM,
  ADD_ITEM_BELOW_MENUITEM,
].sort();
