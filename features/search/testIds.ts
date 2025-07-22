import {
  SEARCH_DIALOG,
  SEARCH_DIALOG_EMPTY,
  SEARCH_DIALOG_LOADING,
} from "../testIds.ts";

export const SEARCH_TEST_IDS = {
  dialog: SEARCH_DIALOG,
  "dialog loading": SEARCH_DIALOG_LOADING,
  "dialog empty": SEARCH_DIALOG_EMPTY,
};

export type SearchPartMeaning = keyof typeof SEARCH_TEST_IDS;
