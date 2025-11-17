import type { TestId } from "../src/components/utilities/testable.ts";

import { buildFullTestId } from "./utilities/buildTestableSelector.ts";

export type SeveralTestIds = TestId[];

export const DEFAULT_TEST_ID = "defaultTestId";

export const PAGE_TAB_TITLE = "pageTabTitle";

export const SIDEBAR = "sidebar";
export const HEADER = "header";
export const SIGN_OUT_BUTTON = "signOutButton";
export const ADD_GROUP_BUTTON = "addGroupButton";
export const PRO_VERSION_BUTTON = "proVersionButton";
export const PAGE_TITLE = "pageTitle";
export const LIST_TITLE_INPUT = "listTitleInput";
export const LIST_PURPOSE_INPUT = "listPurposeInput";
export const LIST_ITEMS = "listItems";

const LIST_ITEM_INPUT_SUFFIX = "Input";
export const LIST_ITEM = "listItem";
export const LIST_ITEM_INPUT = buildListItemInputTestId(LIST_ITEM);
export const DRAGGED_LIST_ITEM = "draggedListItem";
export const DRAGGED_LIST_ITEM_INPUT = buildListItemInputTestId(DRAGGED_LIST_ITEM);

export function buildListItemInputTestId(listItemTestId: TestId): TestId {
  return `${listItemTestId}${LIST_ITEM_INPUT_SUFFIX}`;
}

export function extractListItemTestIdFromItsInputTestId(listItemInoutTestId: TestId): TestId {
  return listItemInoutTestId.replace(LIST_ITEM_INPUT_SUFFIX, "");
}

export const AUTO_LIST_ITEM = "autoListItem";
export const AUTO_LIST_ITEM_INPUT = buildListItemInputTestId(AUTO_LIST_ITEM);

export const LIST_ITEM_CONTEXT_MENU = "listItemContextMenu";

export const CREATE_LIST_BUTTON = "createListButton";
export const SAVE_LIST_BUTTON = "saveListButton";
export const OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON = "openContextMenuListItemButton";
export const OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON = "openContextMenuListStripeButton";
export const REMOVE_ITEM_MENUITEM = "removeItemMenuitem";
export const ADD_ITEM_ABOVE_MENUITEM = "addItemAboveMenuitem";
export const ADD_ITEM_BELOW_MENUITEM = "addItemBelowMenuitem";

export const SEARCH_INPUT = "searchInput";
export const SEARCH_BUTTON = "searchButton";
export const OPEN_SEARCH_BUTTON = "openSearchButton";
export const CLOSE_SEARCH_BUTTON = "closeSearchButton";
export const CLEAR_SEARCH_BUTTON = buildClearInputButtonTestId(SEARCH_INPUT);
export const SEARCH_DIALOG = "searchDialog";
export const SEARCH_DIALOG_LOADING = "searchDialogLoading";
export const SEARCH_DIALOG_EMPTY = "searchDialogEmpty";
export const SEARCH_RESULT = "searchResult";
export const SEARCH_RESULTS = "searchResults";
export const SEARCH_NETWORK_ERROR = "searchNetworkError";
export const SEARCH_NETWORK_ERROR_CLOSE_BUTTON = `${SEARCH_NETWORK_ERROR}CloseButton`;

export function buildClearInputButtonTestId(inputTestId: TestId): TestId {
  return `${inputTestId}ClearButton`;
}

export const USER_BUTTON = "userButton";

const COUNTER_SUFFIX = "Counter";

export function buildInputCounterTestId(inputId: TestId): TestId {
  return `${inputId}${COUNTER_SUFFIX}`;
}

export function extractInputTestIdFromItsCounterTestId(counterTestId: TestId): TestId {
  return counterTestId.replace(COUNTER_SUFFIX, "");
}

export const NOTE_ACCORDION = "noteAccordion";

export function buildAccordionContentTestId(accordionTestId: TestId): TestId {
  return `${accordionTestId}Content`;
}

export function buildAccordionButtonTestId(accordionTestId: TestId): TestId {
  return `${accordionTestId}Button`;
}

export const NOTE_TEXT_AREA = "noteTextArea";

export const buildTextAreaCounterTestId = buildInputCounterTestId;

export const ITEMS_LIMIT_REACHED_WARNING = "itemsLimitReachedWarning";
export const LISTS_LIMIT_REACHED_WARNING = "listsLimitReachedWarning";
export const WARNINGS_TEST_IDS = {
  "items limit reached": ITEMS_LIMIT_REACHED_WARNING,
  "lists limit reached": LISTS_LIMIT_REACHED_WARNING,
};
export type WarningMeaning = keyof typeof WARNINGS_TEST_IDS;

export const NETWORK_ERROR = "networkError";
export const NETWORK_ERROR_CLOSE_BUTTON = buildErrorCloseButtonTestId(NETWORK_ERROR);
export const LIST_REMOVAL_ERROR = "listRemovalError";
export const LIST_REMOVAL_ERROR_CLOSE_BUTTON = buildErrorCloseButtonTestId(LIST_REMOVAL_ERROR);

export function buildErrorCloseButtonTestId(errorTestId: TestId): TestId {
  return `${errorTestId}CloseButton`;
}

export const ERRORS_TEST_IDS = {
  connection: NETWORK_ERROR,
  "single connection": buildFullTestId(NETWORK_ERROR, 1),
  "single list removal": buildFullTestId(LIST_REMOVAL_ERROR, 1),
};
export type ErrorMeaning = keyof typeof ERRORS_TEST_IDS;
export const ERROR_CLOSE_BUTTONS_TEST_IDS: Record<ErrorMeaning, TestId> = {
  connection: NETWORK_ERROR_CLOSE_BUTTON,
  "single connection": buildFullTestId(NETWORK_ERROR_CLOSE_BUTTON, 1),
  "single list removal": buildFullTestId(LIST_REMOVAL_ERROR_CLOSE_BUTTON, 1),
};

export const NO_SAVED_LISTS_MESSAGE = "noSavedListsMessage";

export const LIST_STRIPE = "listStripe";
export const LIST_STRIPE_LINK_TO_VIEW = "listStripeLinkToView";
export const LIST_STRIPE_EDIT_BUTTON = "listStripeEditButton";
export const LIST_STRIPE_REMOVE_BUTTON = "listStripeRemoveButton";
export const LIST_STRIPE_CONTEXT_MENU = "listStripeContextMenu";

export const REMOVE_LIST_DIALOG = "removeListDialog";
export const DIALOG_CLOSE_BUTTON = "dialogCloseButton";
export const REMOVE_DIALOG_REMOVE_LIST_BUTTON = "removeDialogRemoveListButton";

export const IMPORT_DIALOG = "importDialog";
export const IMPORT_DIALOG_IMPORT_BUTTON = "importDialogImportButton";

export const DRAG_HANDLE = "dragHandle";

export const CHECKLIST_SWITCH = "checklistSwitch";
export const CHECKBOX = "checkbox";

export const TOGGLE_SIDEBAR_BUTTON = "toggleSidebarButton";
export const TOGGLE_TOOLS_PANEL_BUTTON = "toggleToolsPanelButton";

export const TOOLS_PANEL = "toolsPanel";
export const TOOLS_PANEL_ADD_ITEM_BUTTON = "toolsPanelAddItemButton";
export const TOOLS_PANEL_BUTTON_COPY_ITEMS = "toolsPanelButtonCopyItems";
export const TOOLS_PANEL_BUTTON_REMOVE_LIST = "toolsPanelButtonRemoveList";
export const TOOLS_PANEL_BUTTON_PRINT_LIST = "toolsPanelButtonPrintList";
export const TOOLS_PANEL_BUTTON_IMPORT_LIST = "toolsPanelButtonImportList";

export const PRINT_LIST_TITLE = "printListTitle";
export const PRINT_LIST_PURPOSE = "printListPurpose";
export const PRINT_LIST_NOTE = "printListNote";
export const PRINT_LIST_ITEM = "printListItem";
