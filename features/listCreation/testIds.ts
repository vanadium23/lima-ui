import { ITEMS_LIMIT } from "../../configuration.ts";
import {
  buildInputCounterTestId,
  buildTextAreaCounterTestId,
  CHECKLIST_SWITCH,
  DIALOG_REMOVE_BUTTON,
  DIALOG_RETURN_BUTTON,
  LIST_ITEM,
  LIST_ITEM_INPUT,
  LIST_PURPOSE_INPUT,
  LIST_STRIPE_REMOVE_BUTTON,
  LIST_TITLE_INPUT,
  NOTE_ACCORDION,
  NOTE_TEXT_AREA,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
  OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON,
  REMOVE_ITEM_MENUITEM,
  SAVE_LIST_BUTTON,
  TOOLS_BUTTON_COPY_ITEMS,
  TOOLS_BUTTON_PRINT_LIST,
  TOOLS_BUTTON_REMOVE_LIST,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
} from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";

export const BUTTON_TEST_IDS = {
  save: SAVE_LIST_BUTTON,
  "add list item": TOOLS_PANEL_ADD_ITEM_BUTTON,
  "remove item": REMOVE_ITEM_MENUITEM,
  "open context menu list item": OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
  "open context menu first item": buildFullTestId(
    OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
    0,
  ),
  "open context menu second item": buildFullTestId(
    OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
    1,
  ),
  "open context menu for last list item of the limit": buildFullTestId(
    OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
    ITEMS_LIMIT - 1,
  ),
  "remove list": LIST_STRIPE_REMOVE_BUTTON,
  "cancel list removal": DIALOG_RETURN_BUTTON,
  "confirm list removal": DIALOG_REMOVE_BUTTON,
  "copy items": TOOLS_BUTTON_COPY_ITEMS,
  "remove list tools panel": TOOLS_BUTTON_REMOVE_LIST,
  "print list": TOOLS_BUTTON_PRINT_LIST,
  "open context menu list stripe": OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON,
};
export type ButtonMeaning = keyof typeof BUTTON_TEST_IDS;

export const MENUITEM_TEST_IDS = {
  "remove list item": REMOVE_ITEM_MENUITEM,
  "remove first list item": buildFullTestId(REMOVE_ITEM_MENUITEM, 0),
  "remove second list item": buildFullTestId(REMOVE_ITEM_MENUITEM, 1),
  "remove on the last list item of the limit": buildFullTestId(
    REMOVE_ITEM_MENUITEM,
    ITEMS_LIMIT - 1,
  ),
};
export type MenuitemMeaning = keyof typeof MENUITEM_TEST_IDS;

export const INPUT_TEST_IDS = {
  "list title": LIST_TITLE_INPUT,
  "list purpose": LIST_PURPOSE_INPUT,
  "first item": buildFullTestId(LIST_ITEM_INPUT, 0),
  "second item": buildFullTestId(LIST_ITEM_INPUT, 1),
  "third item": buildFullTestId(LIST_ITEM_INPUT, 2),
  "forth item": buildFullTestId(LIST_ITEM_INPUT, 3),
};
export type InputMeaning = keyof typeof INPUT_TEST_IDS;

export const COUNTER_TEST_IDS = {
  "list title input": buildInputCounterTestId(LIST_TITLE_INPUT),
  "list purpose input": buildInputCounterTestId(LIST_PURPOSE_INPUT),
  "first item input": buildFullTestId(
    buildInputCounterTestId(LIST_ITEM_INPUT),
    0,
  ),
  "list note text area": buildTextAreaCounterTestId(NOTE_TEXT_AREA),
};
export type CounterMeaning = keyof typeof COUNTER_TEST_IDS;

export const ELEMENT_TEST_IDS = {
  "first list item": buildFullTestId(LIST_ITEM, 0),
  "second list item": buildFullTestId(LIST_ITEM, 1),
  "on the last list item of the limit": buildFullTestId(
    LIST_ITEM,
    ITEMS_LIMIT - 1,
  ),
};
export type ElementMeaning = keyof typeof ELEMENT_TEST_IDS;

export const ACCORDION_TEST_IDS = {
  "list note": NOTE_ACCORDION,
};
export type AccordionMeaning = keyof typeof ACCORDION_TEST_IDS;

export const TEXT_AREA_TEST_IDS = {
  "list note": NOTE_TEXT_AREA,
};
export type TextAreaMeaning = keyof typeof TEXT_AREA_TEST_IDS;

export const SWITCH_TEST_IDS = {
  checklist: CHECKLIST_SWITCH,
};
export type SwitchMeaning = keyof typeof SWITCH_TEST_IDS;
