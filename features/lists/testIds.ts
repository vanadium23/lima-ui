import { REMOVE_LIST_DIALOG } from "../testIds.ts";

export const LIST_STRIPE_TEST_IDS = {
  first: 0,
};
export type ListStripeMeaning = keyof typeof LIST_STRIPE_TEST_IDS;

export const DIALOG_TEST_IDS = {
  "remove list": REMOVE_LIST_DIALOG,
};
export type DialogMeaning = keyof typeof DIALOG_TEST_IDS;

export const DIALOG_TEST_SUB_IDS: Record<DialogMeaning, string> = {
  "remove list": "createdListId",
};
