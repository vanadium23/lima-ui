import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { ITEMS_LIMIT } from "../../../configuration.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import { AUTO_LIST_ITEM_INPUT, LIST_ITEM_INPUT } from "../../testIds.ts";

import { getTimeoutOrCancelItIfDebugging } from "../../utilities/getTimeoutOrCancelItIfDebugging.ts";
import {
  ITEM_ADDERS,
  ITEM_INPUT_TEST_IDS,
  type ItemInputMeaning,
} from "./testIds.ts";

Then(
  "I expect not to see the {string} item input",
  async function (this: ComplexWorld, itemInputMeaning: ItemInputMeaning) {
    const itemInputFullTestId = this.accounting.itemAdders.registerTestId(
      ITEM_INPUT_TEST_IDS[itemInputMeaning],
    );

    await expect(this.locateByFullId(itemInputFullTestId)).not.toBeInViewport();
  },
);

When(
  "I add list items to their limit via automatically added item",
  { timeout: getTimeoutOrCancelItIfDebugging(60000) },
  async function (this: ComplexWorld) {
    await this.locateByIdParts(LIST_ITEM_INPUT).fill("0");

    for (let i = 1; i < ITEMS_LIMIT; i++) {
      await this.locateByIdParts(AUTO_LIST_ITEM_INPUT).fill(`${i}`);
    }
  },
);

When(
  "I reviewed all item addition method of the list page",
  async function (this: ComplexWorld) {
    const accountedTestIds = this.accounting.itemAdders.getTestIds();

    expect(accountedTestIds).toEqual(ITEM_ADDERS);
  },
);
