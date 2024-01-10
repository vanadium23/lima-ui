import {
  ADD_ITEM_BUTTON,
  CREATE_LIST_BUTTON,
  IMPORT_BUTTON,
  ITEM_INPUT,
  LIST_TITLE_INPUT,
} from "../testIds.ts";

export const BUTTON_TEST_IDS = {
  create: CREATE_LIST_BUTTON,
  "add item": ADD_ITEM_BUTTON,
  import: IMPORT_BUTTON,
};
export type ButtonMeaning = keyof typeof BUTTON_TEST_IDS;

export const FOCUSABLES_TEST_IDS = {
  "list title input": LIST_TITLE_INPUT,
  "first item input": ITEM_INPUT,
  "add item button": ADD_ITEM_BUTTON,
  "import button": IMPORT_BUTTON,
  "create list button": CREATE_LIST_BUTTON,
};
export type FocusableMeaning = keyof typeof FOCUSABLES_TEST_IDS;
