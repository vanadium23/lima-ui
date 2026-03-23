import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import { PRINT_LIST_ITEM } from "../../testIds.ts";
import { buildFullTestId } from "../../utilities/buildTestableSelector.ts";

const PRINT_ITEM_TEST_IDS = {
  first: buildFullTestId(PRINT_LIST_ITEM, 0),
  second: buildFullTestId(PRINT_LIST_ITEM, 1),
  third: buildFullTestId(PRINT_LIST_ITEM, 2),
};

type PrintItemMeaning = keyof typeof PRINT_ITEM_TEST_IDS;

Then(
  "I expect to see the {string} item on print page to have the following text: {string}",
  async function (this: ComplexWorld, printItemMeaning: PrintItemMeaning, expectedText: string) {
    const printItem = this.locateByFullId(PRINT_ITEM_TEST_IDS[printItemMeaning]);

    await expect(printItem).toBeInViewport();
    await expect(printItem).toHaveText(expectedText);
  },
);
