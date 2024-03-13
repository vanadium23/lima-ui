import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { ComplexWorld } from "../context/hooks.ts";
import { REMOVE_ITEM_BUTTON } from "../testIds.ts";
import { ITEM_INPUT_TEST_IDS, type ItemInputMeaning } from "./testIds.ts";

const MILLISECONDS_IN_SECOND = 1000;

When(
  "I wait for the removal pawl countdown of {int} seconds to pass",
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
    await this.expectLocated(
      ITEM_INPUT_TEST_IDS[itemInputMeaning],
    ).toBeDisabled();
  },
);

Then(
  "I expect to see the only one item input left on the page",
  async function (this: ComplexWorld) {
    await expect(this.locate(REMOVE_ITEM_BUTTON)).toHaveCount(1);
  },
);
