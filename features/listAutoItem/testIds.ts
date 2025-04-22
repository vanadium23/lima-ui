import { ITEMS_LIMIT } from "../../configuration.ts";
import { LIST_ITEM_INPUT } from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";

export const ITEM_INPUT_TEST_IDS = {
  first: buildFullTestId(LIST_ITEM_INPUT, 0),
  second: buildFullTestId(LIST_ITEM_INPUT, 1),
  "exceeding limit": buildFullTestId(LIST_ITEM_INPUT, ITEMS_LIMIT),
};
export type ItemInputMeaning = keyof typeof ITEM_INPUT_TEST_IDS;
