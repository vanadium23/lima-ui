import { ITEMS_LIMIT } from "../../../configuration.ts";
import { AUTO_LIST_ITEM_INPUT, LIST_ITEM } from "../../testIds.ts";
import { buildFullTestId } from "../../utilities/buildTestableSelector.ts";

export const LIST_ITEM_TEST_IDS = {
  first: buildFullTestId(LIST_ITEM, 0),
  second: buildFullTestId(LIST_ITEM, 1),
  third: buildFullTestId(LIST_ITEM, 2),
  "exceeding limit": buildFullTestId(LIST_ITEM, ITEMS_LIMIT),
  automatic: AUTO_LIST_ITEM_INPUT,
};
export type ListItemMeaning = keyof typeof LIST_ITEM_TEST_IDS;
