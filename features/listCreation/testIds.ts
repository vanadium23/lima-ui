import { ITEMS_LIMIT } from "../../configuration.ts";
import {
  ADD_ITEM_BUTTON,
  buildInputCounterTestId,
  buildTextAreaCounterTestId,
  CANCEL_ITEM_REMOVAL_BUTTON,
  CHECKLIST_SWITCH,
  CREATE_LIST_BUTTON,
  DIALOG_REMOVE_BUTTON,
  DIALOG_RETURN_BUTTON,
  ITEM_INPUT,
  ITEM_INPUT_CONTAINER,
  LIST_PURPOSE_INPUT,
  LIST_STRIPE_REMOVE_BUTTON,
  LIST_TITLE_INPUT,
  NOTE_ACCORDION,
  NOTE_TEXT_AREA,
  REMOVE_ITEM_BUTTON,
  TOOLS_BUTTON_COPY_ITEMS,
  TOOLS_BUTTON_PRINT_LIST,
  TOOLS_BUTTON_REMOVE_LIST,
} from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";

export const BUTTON_TEST_IDS = {
  create: CREATE_LIST_BUTTON,
  "add item": ADD_ITEM_BUTTON,
  "remove item": REMOVE_ITEM_BUTTON,
  "remove first item": buildFullTestId(REMOVE_ITEM_BUTTON, 0),
  "remove second item": buildFullTestId(REMOVE_ITEM_BUTTON, 1),
  "remove third item": buildFullTestId(REMOVE_ITEM_BUTTON, 2),
  "remove forth item": buildFullTestId(REMOVE_ITEM_BUTTON, 3),
  "remove on limit item": buildFullTestId(REMOVE_ITEM_BUTTON, ITEMS_LIMIT - 1),
  "cancel item removal": CANCEL_ITEM_REMOVAL_BUTTON,
  "cancel second item removal": buildFullTestId(CANCEL_ITEM_REMOVAL_BUTTON, 1),
  "cancel third item removal": buildFullTestId(CANCEL_ITEM_REMOVAL_BUTTON, 2),
  "remove list": LIST_STRIPE_REMOVE_BUTTON,
  "cancel list removal": DIALOG_RETURN_BUTTON,
  "confirm list removal": DIALOG_REMOVE_BUTTON,
  "copy items": TOOLS_BUTTON_COPY_ITEMS,
  "remove list tools panel": TOOLS_BUTTON_REMOVE_LIST,
  "print list": TOOLS_BUTTON_PRINT_LIST,
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
  "list purpose input": buildInputCounterTestId(LIST_PURPOSE_INPUT),
  "first item input": buildFullTestId(buildInputCounterTestId(ITEM_INPUT), 0),
  "note text area": buildTextAreaCounterTestId(NOTE_TEXT_AREA),
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

export const ACCORDION_TEST_IDS = {
  note: NOTE_ACCORDION,
};
export type AccordionMeaning = keyof typeof ACCORDION_TEST_IDS;

export const TEXT_AREA_TEST_IDS = {
  note: NOTE_TEXT_AREA,
};
export type TextAreaMeaning = keyof typeof TEXT_AREA_TEST_IDS;

export const SWITCH_TEST_IDS = {
  checklist: CHECKLIST_SWITCH,
};
export type SwitchMeaning = keyof typeof SWITCH_TEST_IDS;
