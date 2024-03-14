import {
  ADD_ITEM_BUTTON,
  CREATE_LIST_BUTTON,
  IMPORT_BUTTON,
  ITEM_INPUT,
  ITEM_INPUT_CONTAINER,
  REMOVE_ITEM_BUTTON,
} from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";

export const BUTTON_TEST_IDS = {
  create: CREATE_LIST_BUTTON,
  "add item": ADD_ITEM_BUTTON,
  import: IMPORT_BUTTON,
  "remove first item": buildFullTestId(REMOVE_ITEM_BUTTON, 0),
  "remove second item": buildFullTestId(REMOVE_ITEM_BUTTON, 1),
  "remove third item": buildFullTestId(REMOVE_ITEM_BUTTON, 2),
  "remove forth item": buildFullTestId(REMOVE_ITEM_BUTTON, 3),
  "cancel second item removal": buildFullTestId(REMOVE_ITEM_BUTTON, 1),
  "cancel third item removal": buildFullTestId(REMOVE_ITEM_BUTTON, 2),
};
export type ButtonMeaning = keyof typeof BUTTON_TEST_IDS;

export const ITEM_INPUT_TEST_IDS = {
  "first item": buildFullTestId(ITEM_INPUT, 0),
  "second item": buildFullTestId(ITEM_INPUT, 1),
  "third item": buildFullTestId(ITEM_INPUT, 2),
  "forth item": buildFullTestId(ITEM_INPUT, 3),
};
export type ItemInputMeaning = keyof typeof ITEM_INPUT_TEST_IDS;

export const ELEMENT_TEST_IDS = {
  "first item container": buildFullTestId(ITEM_INPUT_CONTAINER, 0),
};
export type ElementMeaning = keyof typeof ELEMENT_TEST_IDS;
