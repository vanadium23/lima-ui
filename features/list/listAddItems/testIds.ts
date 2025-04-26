import { ITEMS_LIMIT } from "../../../configuration.ts";
import {
  AUTO_LIST_ITEM_INPUT,
  LIST_ITEM_INPUT,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
} from "../../testIds.ts";
import { buildFullTestId } from "../../utilities/buildTestableSelector.ts";

export const ITEM_INPUT_TEST_IDS = {
  first: buildFullTestId(LIST_ITEM_INPUT, 0),
  second: buildFullTestId(LIST_ITEM_INPUT, 1),
  "exceeding limit": buildFullTestId(LIST_ITEM_INPUT, ITEMS_LIMIT),
  automatic: AUTO_LIST_ITEM_INPUT,
};
export type ItemInputMeaning = keyof typeof ITEM_INPUT_TEST_IDS;

export const ITEM_ADDERS = [
  TOOLS_PANEL_ADD_ITEM_BUTTON,
  AUTO_LIST_ITEM_INPUT,
].sort();
