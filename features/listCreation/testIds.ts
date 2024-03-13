import {
  ADD_ITEM_BUTTON,
  CREATE_LIST_BUTTON,
  IMPORT_BUTTON,
  ITEM_INPUT,
  REMOVE_ITEM_BUTTON,
} from "../testIds.ts";
import { buildFullId } from "../utilities/buildTestableSelector.ts";

export const BUTTON_TEST_IDS = {
  create: CREATE_LIST_BUTTON,
  "add item": ADD_ITEM_BUTTON,
  import: IMPORT_BUTTON,
  "remove second item": buildFullId(REMOVE_ITEM_BUTTON, 1),
};
export type ButtonMeaning = keyof typeof BUTTON_TEST_IDS;

export const ITEM_INPUT_TEST_IDS = {
  "second item": buildFullId(ITEM_INPUT, 1),
};
export type ItemInputMeaning = keyof typeof ITEM_INPUT_TEST_IDS;
