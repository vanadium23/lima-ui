import {
  ADD_ITEM_BUTTON,
  buildInputCounterTestId,
  CANCEL_ITEM_REMOVAL_BUTTON,
  CREATE_LIST_BUTTON,
  IMPORT_BUTTON,
  ITEM_INPUT,
  ITEM_INPUT_CONTAINER,
  LIST_PURPOSE_INPUT,
  LIST_TITLE_INPUT,
  REMOVE_ITEM_BUTTON,
} from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";
import { ITEMS_LIMIT } from "../../configuration.ts";

export const BUTTON_TEST_IDS = {
  create: CREATE_LIST_BUTTON,
  "add item": ADD_ITEM_BUTTON,
  import: IMPORT_BUTTON,
  "remove item": REMOVE_ITEM_BUTTON,
  "remove first item": buildFullTestId(REMOVE_ITEM_BUTTON, 0),
  "remove second item": buildFullTestId(REMOVE_ITEM_BUTTON, 1),
  "remove third item": buildFullTestId(REMOVE_ITEM_BUTTON, 2),
  "remove forth item": buildFullTestId(REMOVE_ITEM_BUTTON, 3),
  "remove on limit item": buildFullTestId(REMOVE_ITEM_BUTTON, ITEMS_LIMIT - 1),
  "cancel item removal": CANCEL_ITEM_REMOVAL_BUTTON,
  "cancel second item removal": buildFullTestId(CANCEL_ITEM_REMOVAL_BUTTON, 1),
  "cancel third item removal": buildFullTestId(CANCEL_ITEM_REMOVAL_BUTTON, 2),
};
export type ButtonMeaning = keyof typeof BUTTON_TEST_IDS;

export const INPUT_TEST_IDS = {
  "list title": LIST_TITLE_INPUT,
  "list purpose": LIST_PURPOSE_INPUT,
  "first item": buildFullTestId(ITEM_INPUT, 0),
  "second item": buildFullTestId(ITEM_INPUT, 1),
  "third item": buildFullTestId(ITEM_INPUT, 2),
  "forth item": buildFullTestId(ITEM_INPUT, 3),
};
export type InputMeaning = keyof typeof INPUT_TEST_IDS;

export const COUNTER_TEST_IDS = {
  "list title input": buildInputCounterTestId(LIST_TITLE_INPUT),
  "first item input": buildFullTestId(buildInputCounterTestId(ITEM_INPUT), 0),
};
export type CounterMeaning = keyof typeof COUNTER_TEST_IDS;

export const ELEMENT_TEST_IDS = {
  "first item container": buildFullTestId(ITEM_INPUT_CONTAINER, 0),
  "second item container": buildFullTestId(ITEM_INPUT_CONTAINER, 1),
  "third item container": buildFullTestId(ITEM_INPUT_CONTAINER, 2),
  "forth item container": buildFullTestId(ITEM_INPUT_CONTAINER, 3),
  "on limit item container": buildFullTestId(
    ITEM_INPUT_CONTAINER,
    ITEMS_LIMIT - 1,
  ),
};
export type ElementMeaning = keyof typeof ELEMENT_TEST_IDS;
