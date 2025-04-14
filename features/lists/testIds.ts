import {
  LIST_STRIPE_CONTEXT_MENU,
  LIST_STRIPE_EDIT_BUTTON,
  LIST_STRIPE_LINK_TO_VIEW,
  REMOVE_LIST_DIALOG,
} from "../testIds.ts";

export const LIST_STRIPE_POSITIONS = {
  first: 0,
};
export type ListStripePosition = keyof typeof LIST_STRIPE_POSITIONS;

export const DIALOG_TEST_IDS = {
  "remove list": REMOVE_LIST_DIALOG,
};
export type DialogMeaning = keyof typeof DIALOG_TEST_IDS;

export const LINK_TEST_IDS = {
  "edit list": LIST_STRIPE_EDIT_BUTTON,
  "view list": LIST_STRIPE_LINK_TO_VIEW,
};
export type LinkMeaning = keyof typeof LINK_TEST_IDS;

export const CONTEXT_MENU_TEST_IDS = {
  "list stripe": LIST_STRIPE_CONTEXT_MENU,
};
export type ContextMenuMeaning = keyof typeof CONTEXT_MENU_TEST_IDS;
