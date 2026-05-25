import type { TestId } from "../src/components/utilities/testable.ts";

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
export const IMPORT_ABOVE_MENUITEM = "importAboveMenuitem";
export const IMPORT_BELOW_MENUITEM = "importBelowMenuitem";

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

export const USER_BADGE = "userBadge";

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

export const IMPORT_ERROR = "importError";
export const IMPORT_ERROR_CLOSE_BUTTON = buildErrorCloseButtonTestId(IMPORT_ERROR);

export const LIMIT_EXCEEDED_ERROR = "limitExceededError";
export const LIMIT_EXCEEDED_ERROR_CLOSE_BUTTON = buildErrorCloseButtonTestId(LIMIT_EXCEEDED_ERROR);

export const NO_SAVED_LISTS_MESSAGE = "noSavedListsMessage";

export const LIST_STRIPE = "listStripe";
export const LIST_STRIPE_LINK_TO_VIEW = "listStripeLinkToView";
export const LIST_STRIPE_EDIT_BUTTON = "listStripeEditButton";
export const LIST_STRIPE_REMOVE_BUTTON = "listStripeRemoveButton";
export const LIST_STRIPE_CONTEXT_MENU = "listStripeContextMenu";

export const REMOVE_LIST_DIALOG = "removeListDialog";
export const REMOVE_EXPORTED_ITEM_DIALOG = "removeExportedItemDialog";

export function buildCloseDialogTestId(dialogTestId: TestId): TestId {
  return `${dialogTestId}CloseButton`;
}

export function buildLoadingDialogTestId(dialogTestId: TestId): TestId {
  return `${dialogTestId}Loading`;
}

export function buildCheckboxTestId(testId: TestId): TestId {
  return `${testId}Checkbox`;
}
export const REMOVE_DIALOG_REMOVE_LIST_BUTTON = "removeDialogRemoveListButton";
export const REMOVE_DIALOG_DELETION_EXPORTED_LIST_BUTTON = "removeDialogDeletionExportedListButton";
export const REMOVE_DIALOG_INSERTION_EXPORTED_LIST_BUTTON = "removeDialogInsertionExportedListButton";
export const REMOVE_DIALOG_DELETION_EXPORTED_ITEM_BUTTON = "removeDialogDeletionExportedItemButton";
export const REMOVE_DIALOG_INSERTION_EXPORTED_ITEM_BUTTON = "removeDialogInsertionExportedItemButton";

export const IMPORT_DIALOG = "importDialog";
export const IMPORT_DIALOG_IMPORT_BUTTON = "importDialogImportButton";
export const IMPORT_DIALOG_EMPTY_MESSAGE = "importDialogEmptyMessage";
export const IMPORT_DIALOG_LOADING = buildLoadingDialogTestId(IMPORT_DIALOG);
export const LIST_STRIPE_IMPORT = "listStripeImport";
export const LIST_STRIPE_IMPORT_CHECKBOX = buildCheckboxTestId(LIST_STRIPE_IMPORT);
export const LIST_STRIPE_IMPORT_HEADER = "listStripeImportHeader";
export const LIST_STRIPE_IMPORT_ITEM = "listStripeImportItem";
export const LIST_STRIPE_IMPORT_ITEM_CHECKBOX = buildCheckboxTestId(LIST_STRIPE_IMPORT_ITEM);
export const IMPORT_DIALOG_COUNTER = "importDialogCounter";

export const IMPORTED_GROUP = "importedGroup";
export const IMPORTED_GROUP_ITEM = "importedGroupItem";
export const IMPORTED_GROUP_NAME_LINK = "importedGroupNameLink";
export const OPEN_CONTEXT_MENU_IMPORTED_GROUP_BUTTON = "openContextMenuImportedGroupButton";
export const GO_TO_SOURCE_LIST_MENUITEM = "goToSourceListMenuitem";
export const REMOVE_IMPORTED_GROUP_MENUITEM = "removeImportedGroupMenuitem";
export const EDIT_IMPORTED_GROUP_MENUITEM = "editImportedGroupMenuitem";
export const EDIT_IMPORTED_GROUP_DIALOG = "editImportedGroupDialog";
export const EDIT_IMPORTED_GROUP_BUTTON = "editImportedGroupButton";

export const EXPORTED_TO_BUTTON = "exportedToButton";
export const EXPORTED_TO_ITEM_BUTTON = "exportedToItemButton";
export const EXPORTED_TO_MARK = "exportedToMark";
export const EXPORTED_TO_LIST = "exportedToList";
export const EXPORTED_TO_LIST_ITEM = "exportedToListItem";

export const DRAG_HANDLE = "dragHandle";

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
export const PRINT_LIST_ERROR = "printListError";

export const AUTH_TABS = "authTabs";
export const AUTH_GREETING_TITLE = "authGreetingTitle";
export const REG_EMAIL_INPUT = "registrationEmailInput";
export const REG_PASS_INPUT = "registrationPasswordInput";
export const REG_REPEAT_PASS_INPUT = "registrationRepeatPasswordInput";
export const REG_ACCEPT_AGREEMENT = "registrationAcceptAgreementCheckbox";
export const REG_SUBMIT_BUTTON = "registrationSubmitButton";
export const REG_GO_TO_AUTH_LINK = "registrationGoToAuthLink";
export const REG_NETWORK_ERROR = "registrationNetworkError";
export const REG_CONFIDENTIAL_POLICY_LINK = "registrationPolicyLink";
export const REG_USERS_AGREEMENT_LINK = "registrationAgreementLink";
export const LOGIN_EMAIL_INPUT = "loginEmailInput";
export const LOGIN_PASS_INPUT = "loginPasswordInput";
export const LOGIN_SUBMIT_BUTTON = "loginSubmitButton";
export const LOGIN_GO_TO_REG_LINK = "loginGoToRegLink";
export const LOGIN_RESTORE_PASS_LINK = "loginRestorePassLink";
export const RESTORE_PASS_BACK_TO_LOGIN_LINK = "restorePassBackToLoginLink";
export const RESTORE_PASS_EMAIL_INPUT = "restorePassEmailInput";
export const RESTORE_PASS_SUBMIT_BUTTON = "restorePassSubmitButton";
export const NEW_PASSWORD_PASS_INPUT = "newPasswordPassInput";
export const NEW_PASSWORD_REPEAT_PASS_INPUT = "newPasswordRepeatPassInput";
export const NEW_PASSWORD_SUBMIT_BUTTON = "newPasswordSubmitButton";
export const PAGE_NOT_FOUND = "pageNotFound";
