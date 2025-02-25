import type { TestId } from "../src/components/utilities/testable.ts";

export type SeveralTestIds = TestId[];

export const DEFAULT_TEST_ID = "defaultTestId";

export const SIDEBAR = "sidebar";
export const HEADER = "header";
export const ADD_GROUP_BUTTON = "addGroupButton";
export const PRO_VERSION_BUTTON = "proVersionButton";
export const PAGE_TITLE = "pageTitle";
export const LIST_TITLE_INPUT = "listTitleInput";
export const LIST_PURPOSE_INPUT = "listPurposeInput";
export const ITEMS_INPUTS = "itemsInputs";
export const ITEM_INPUT_CONTAINER = "itemInputContainer";
export const ITEM_INPUT = "itemInput";
export const SEARCH_INPUT = "searchInput";
export const CREATE_LIST_BUTTON = "createListButton";
export const ADD_ITEM_BUTTON = "addItemButton";
export const REMOVE_ITEM_BUTTON = "removeItemButton";
export const CANCEL_ITEM_REMOVAL_BUTTON = "cancelItemRemovalButton";
export const SEARCH_BUTTON = "searchButton";
export const USER_BUTTON = "userButton";

const COUNTER_SUFFIX = "Counter";

export function buildInputCounterTestId(inputId: TestId): TestId {
  return `${inputId}${COUNTER_SUFFIX}`;
}

export function extractInputTestIdFromItsCounterTestId(
  counterTestId: TestId,
): TestId {
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
export const LIST_REMOVAL_ERROR = "listRemovalError";
export const ERRORS_TEST_IDS = {
  connection: NETWORK_ERROR,
  "list removal": LIST_REMOVAL_ERROR,
};
export type ErrorMeaning = keyof typeof ERRORS_TEST_IDS;

export const NO_SAVED_LISTS_MESSAGE = "noSavedListsMessage";

export const LIST_STRIPE = "listStripe";
export const LIST_STRIPE_LINK_TO_VIEW = "listStripeLinkToView";
export const LIST_STRIPE_EDIT_BUTTON = "listStripeEditButton";
export const LIST_STRIPE_REMOVE_BUTTON = "listStripeRemoveButton";

export const REMOVE_LIST_DIALOG = "removeListDialog";
export const DIALOG_RETURN_BUTTON = "dialogReturnButton";
export const DIALOG_REMOVE_BUTTON = "dialogRemoveButton";

export const DRAG_HANDLE = "dragHandle";

export const CHECKLIST_SWITCH = "checklistSwitch";
export const CHECKBOX = "checkbox";

export const DROPDOWN_MENU_BUTTON = "dropDownMenuButton";

export const TOGGLE_TOOLS_PANEL_BUTTON = "toggleToolsPanelButton";

export const TOOLS_PANEL = "toolsPanel";
export const TOOLS_BUTTON_COPY_ITEMS = "toolsButtonCopyItems";
export const TOOLS_BUTTON_REMOVE_LIST = "toolsButtonRemoveList";
export const TOOLS_BUTTON_PRINT_LIST = "toolsButtonPrintList";
