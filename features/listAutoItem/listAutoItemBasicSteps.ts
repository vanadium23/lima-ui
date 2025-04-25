import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { ITEMS_LIMIT } from "../../configuration.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import { AUTO_LIST_ITEM_INPUT, LIST_ITEM_INPUT } from "../testIds.ts";

import { ITEM_INPUT_TEST_IDS, type ItemInputMeaning } from "./testIds.ts";

Then(
  "I expect not to see the {string} item input",
  async function (this: ComplexWorld, itemInputMeaning: ItemInputMeaning) {
    await expect(
      this.locateByFullId(ITEM_INPUT_TEST_IDS[itemInputMeaning]),
    ).not.toBeInViewport();
  },
);

When(
  "I add list items to their limit via automatically added item",
  { timeout: 60000 },
  async function (this: ComplexWorld) {
    await this.locate(LIST_ITEM_INPUT).nth(0).fill(`${0}`);

    for (let i = 1; i < ITEMS_LIMIT; i++) {
      await this.locate(AUTO_LIST_ITEM_INPUT).fill(`${i}`);
    }
  },
);
