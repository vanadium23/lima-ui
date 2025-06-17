import {
  ADD_ITEM_ABOVE_MENUITEM,
  ADD_ITEM_BELOW_MENUITEM,
  AUTO_LIST_ITEM,
  AUTO_LIST_ITEM_INPUT,
  LIST_ITEM_INPUT,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
} from "../../testIds.ts";
import { buildFullTestId } from "../../utilities/buildTestableSelector.ts";

export const ITEM_INPUT_TEST_IDS = {
  single: buildFullTestId(LIST_ITEM_INPUT, 0),
  first: buildFullTestId(LIST_ITEM_INPUT, 0),
  second: buildFullTestId(LIST_ITEM_INPUT, 1),
  automatic: buildFullTestId(AUTO_LIST_ITEM_INPUT, AUTO_LIST_ITEM),
};
export type ItemInputMeaning = keyof typeof ITEM_INPUT_TEST_IDS;

export const ITEM_ADDERS = [
  TOOLS_PANEL_ADD_ITEM_BUTTON,
  buildFullTestId(AUTO_LIST_ITEM_INPUT, AUTO_LIST_ITEM),
  ADD_ITEM_ABOVE_MENUITEM,
  ADD_ITEM_BELOW_MENUITEM,
].sort();
