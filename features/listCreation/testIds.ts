import {
  ADD_ITEM_BUTTON,
  CREATE_LIST_BUTTON,
  IMPORT_BUTTON,
} from "../testIds.ts";

export const BUTTON_TEST_IDS = {
  create: CREATE_LIST_BUTTON,
  "add item": ADD_ITEM_BUTTON,
  import: IMPORT_BUTTON,
};
export type ButtonMeaning = keyof typeof BUTTON_TEST_IDS;
