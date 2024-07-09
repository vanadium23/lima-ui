import type { TestId } from "../src/components/utilities/testable.ts";

export type SeveralTestIds = TestId[];

export const DEFAULT_TEST_ID = "defaultTestId";

export const SIDEBAR = "sidebar";
export const ADD_GROUP_BUTTON = "addGroupButton";
export const PRO_VERSION_BUTTON = "proVersionButton";
export const PAGE_TITLE = "pageTitle";
export const LIST_TITLE_INPUT = "listTitleInput";
export const LIST_PURPOSE_INPUT = "listPurposeInput";
export const ITEMS_INPUTS = "itemsInputs";
export const ITEM_INPUT_CONTAINER = "itemInputContainer";
export const ITEM_INPUT = "itemInput";
export const CREATE_LIST_BUTTON = "createListButton";
export const ADD_ITEM_BUTTON = "addItemButton";
export const IMPORT_BUTTON = "importButton";
export const ITEMS_LIMIT_REACHED_WARNING = "itemsLimitReachedWarning";
export const REMOVE_ITEM_BUTTON = "removeItemButton";
export const CANCEL_ITEM_REMOVAL_BUTTON = "cancelItemRemovalButton";

const COUNTER_SUFFIX = `Counter`;

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

export const NETWORK_ERROR = "networkError";
