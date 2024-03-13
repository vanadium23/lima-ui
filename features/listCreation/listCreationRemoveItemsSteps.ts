import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { ComplexWorld } from "../context/hooks.ts";
import { REMOVE_ITEM_BUTTON } from "../testIds.ts";
import { type ItemInputMeaning, ITEM_INPUT_TEST_IDS } from "./testIds.ts";
import { destructureFullId } from "../utilities/buildTestableSelector.ts";

const MILLISECONDS_IN_SECOND = 1000;

When(
  "I wait for the deletion pawl countdown of {int} seconds to pass",
  { timeout: 10000 },
  async function (this: ComplexWorld, seconds: number) {
    const SOME_EXTRA_TIME = Math.floor(Math.random() * MILLISECONDS_IN_SECOND);

    await this.page.waitForTimeout(
      seconds * MILLISECONDS_IN_SECOND + SOME_EXTRA_TIME,
    );
  },
);

Then(
  "I expect to see the {string} input disabled",
  async function (this: ComplexWorld, itemInputMeaning: ItemInputMeaning) {
    const itemInputFullTestId = ITEM_INPUT_TEST_IDS[itemInputMeaning];
    const { testId, testSubId } = destructureFullId(itemInputFullTestId);

    const itemInput = testSubId
      ? this.locate(testId, testSubId)
      : this.locate(testId);

    await expect(itemInput).toBeDisabled();
  },
);

Then(
  "I expect to see the only one item input left on the page",
  async function (this: ComplexWorld) {
    await expect(this.locate(REMOVE_ITEM_BUTTON)).toHaveCount(1);
  },
);
