import {
  PRINT_LIST_ITEM,
  PRINT_LIST_NOTE,
  PRINT_LIST_PURPOSE,
  PRINT_LIST_TITLE,
} from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";

export const PRINT_ELEMENT_TEST_IDS = {
  "list title": PRINT_LIST_TITLE,
  "list purpose": PRINT_LIST_PURPOSE,
  "list note": PRINT_LIST_NOTE,
  "first item": buildFullTestId(PRINT_LIST_ITEM, 0),
  "second item": buildFullTestId(PRINT_LIST_ITEM, 1),
  "third item": buildFullTestId(PRINT_LIST_ITEM, 2),
};

export type PrintElementMeaning = keyof typeof PRINT_ELEMENT_TEST_IDS;
