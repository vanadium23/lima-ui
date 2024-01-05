export const DEFAULT_TEST_ID = "defaultTestId";

export const SIDEBAR = "sidebar";
export const PAGE_TITLE = "pageTitle";
export const LIST_TITLE_INPUT = "listTitleInput";
export const ITEMS_INPUTS = "itemsInputs";
export const ITEM_INPUT = "itemInput";
export const CREATE_LIST_BUTTON = "createListButton";
export const ADD_ITEM_BUTTON = "addItemButton";
export const IMPORT_BUTTON = "importButton";

export const BUTTON_TEST_IDS = {
  create: CREATE_LIST_BUTTON,
  "add item": ADD_ITEM_BUTTON,
  import: IMPORT_BUTTON,
};
export type ButtonTestId = keyof typeof BUTTON_TEST_IDS;
export type TestId = string;
export type SeveralTestIds = TestId[];
