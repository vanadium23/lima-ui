import { ITEMS_LIMIT } from "../../../configuration.ts";
import {
  ADD_ITEM_ABOVE_MENUITEM,
  ADD_ITEM_BELOW_MENUITEM,
  AUTO_LIST_ITEM,
  AUTO_LIST_ITEM_INPUT,
  buildCloseDialogTestId,
  buildInputCounterTestId,
  buildTextAreaCounterTestId,
  CLEAR_SEARCH_BUTTON,
  CREATE_LIST_BUTTON,
  EDIT_IMPORTED_GROUP_BUTTON,
  EDIT_IMPORTED_GROUP_MENUITEM,
  EXPORTED_TO_BUTTON,
  GO_TO_SOURCE_LIST_MENUITEM,
  IMPORT_ABOVE_MENUITEM,
  IMPORT_BELOW_MENUITEM,
  IMPORT_DIALOG,
  IMPORT_DIALOG_IMPORT_BUTTON,
  LIST_ITEM,
  LIST_ITEM_INPUT,
  LIST_PURPOSE_INPUT,
  LIST_STRIPE_EDIT_BUTTON,
  LIST_STRIPE_REMOVE_BUTTON,
  LIST_TITLE_INPUT,
  NOTE_ACCORDION,
  NOTE_TEXT_AREA,
  OPEN_CONTEXT_MENU_IMPORTED_GROUP_BUTTON,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
  OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON,
  REMOVE_DIALOG_REMOVE_LIST_BUTTON,
  REMOVE_IMPORTED_GROUP_MENUITEM,
  REMOVE_ITEM_MENUITEM,
  REMOVE_LIST_DIALOG,
  SAVE_LIST_BUTTON,
  SEARCH_BUTTON,
  SEARCH_INPUT,
  SEARCH_NETWORK_ERROR_CLOSE_BUTTON,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
  TOOLS_PANEL_BUTTON_COPY_ITEMS,
  TOOLS_PANEL_BUTTON_IMPORT_LIST,
  TOOLS_PANEL_BUTTON_PRINT_LIST,
  TOOLS_PANEL_BUTTON_REMOVE_LIST,
} from "../../testIds.ts";
import { buildFullTestId } from "../../utilities/buildTestableSelector.ts";

export const BUTTON_TEST_IDS = {
  create: CREATE_LIST_BUTTON,
  save: SAVE_LIST_BUTTON,
  "add list item": TOOLS_PANEL_ADD_ITEM_BUTTON,
  "remove item": REMOVE_ITEM_MENUITEM,
  "open context menu list item": OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
  "open context menu first item": buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 0),
  "open context menu second item": buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 1),
  "open context menu third item": buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 2),
  "open context menu forth item": buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, 3),
  "open context menu for last list item of the limit": buildFullTestId(
    OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
    ITEMS_LIMIT - 1,
  ),
  "open context menu for automatic list item": buildFullTestId(OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON, AUTO_LIST_ITEM),
  "remove list": LIST_STRIPE_REMOVE_BUTTON,
  "cancel list removal": buildCloseDialogTestId(REMOVE_LIST_DIALOG),
  "confirm list removal": REMOVE_DIALOG_REMOVE_LIST_BUTTON,
  "copy items": TOOLS_PANEL_BUTTON_COPY_ITEMS,
  import: IMPORT_DIALOG_IMPORT_BUTTON,
  "cancel import": buildCloseDialogTestId(IMPORT_DIALOG),
  "tools panel import": TOOLS_PANEL_BUTTON_IMPORT_LIST,
  "remove list tools panel": TOOLS_PANEL_BUTTON_REMOVE_LIST,
  "print list": TOOLS_PANEL_BUTTON_PRINT_LIST,
  "open context menu list stripe": OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON,
  "open context menu first list stripe": buildFullTestId(OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON, 0),
  "first list stripe edit": buildFullTestId(LIST_STRIPE_EDIT_BUTTON, 0),
  "second list stripe edit": buildFullTestId(LIST_STRIPE_EDIT_BUTTON, 1),
  search: SEARCH_BUTTON,
  "clear search": CLEAR_SEARCH_BUTTON,
  "close search error notification": SEARCH_NETWORK_ERROR_CLOSE_BUTTON,
  "exported to": EXPORTED_TO_BUTTON,
  "open context menu imported group": OPEN_CONTEXT_MENU_IMPORTED_GROUP_BUTTON,
  "edit imported group": EDIT_IMPORTED_GROUP_BUTTON,
};
export type ButtonMeaning = keyof typeof BUTTON_TEST_IDS;

export const MENUITEM_TEST_IDS = {
  "remove list item": REMOVE_ITEM_MENUITEM,
  "remove first list item": buildFullTestId(REMOVE_ITEM_MENUITEM, 0),
  "remove second list item": buildFullTestId(REMOVE_ITEM_MENUITEM, 1),
  "remove third list item": buildFullTestId(REMOVE_ITEM_MENUITEM, 2),
  "remove on the last list item of the limit": buildFullTestId(REMOVE_ITEM_MENUITEM, ITEMS_LIMIT - 1),
  "remove automatic list item": buildFullTestId(REMOVE_ITEM_MENUITEM, AUTO_LIST_ITEM),
  "add item above": ADD_ITEM_ABOVE_MENUITEM,
  "add item below": ADD_ITEM_BELOW_MENUITEM,
  "import element above": IMPORT_ABOVE_MENUITEM,
  "import element below": IMPORT_BELOW_MENUITEM,
  "edit first list": buildFullTestId(LIST_STRIPE_EDIT_BUTTON, 0),
  "edit second list": buildFullTestId(LIST_STRIPE_EDIT_BUTTON, 1),
  "go to source list": GO_TO_SOURCE_LIST_MENUITEM,
  "remove imported group": REMOVE_IMPORTED_GROUP_MENUITEM,
  "edit imported group": EDIT_IMPORTED_GROUP_MENUITEM,
};
export type MenuitemMeaning = keyof typeof MENUITEM_TEST_IDS;

export const INPUT_TEST_IDS = {
  "list title": LIST_TITLE_INPUT,
  "list purpose": LIST_PURPOSE_INPUT,
  "first item": buildFullTestId(LIST_ITEM_INPUT, 0),
  "second item": buildFullTestId(LIST_ITEM_INPUT, 1),
  "third item": buildFullTestId(LIST_ITEM_INPUT, 2),
  "forth item": buildFullTestId(LIST_ITEM_INPUT, 3),
  "automatic item": AUTO_LIST_ITEM_INPUT,
  "last item": LIST_ITEM_INPUT,
  "some item": LIST_ITEM_INPUT,
  "search bar": SEARCH_INPUT,
};
export type InputMeaning = keyof typeof INPUT_TEST_IDS;

export const COUNTER_TEST_IDS = {
  "list title input": buildInputCounterTestId(LIST_TITLE_INPUT),
  "list purpose input": buildInputCounterTestId(LIST_PURPOSE_INPUT),
  "first item input": buildFullTestId(buildInputCounterTestId(LIST_ITEM_INPUT), 0),
  "list note text area": buildTextAreaCounterTestId(NOTE_TEXT_AREA),
};
export type CounterMeaning = keyof typeof COUNTER_TEST_IDS;

export const ELEMENT_TEST_IDS = {
  "first list item": buildFullTestId(LIST_ITEM, 0),
  "second list item": buildFullTestId(LIST_ITEM, 1),
  "third list item": buildFullTestId(LIST_ITEM, 2),
  "forth list item": buildFullTestId(LIST_ITEM, 3),
  "on the last list item of the limit": buildFullTestId(LIST_ITEM, ITEMS_LIMIT - 1),
  "automatic list item": AUTO_LIST_ITEM,
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
