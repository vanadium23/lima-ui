import { Then } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { ERROR_CLOSE_BUTTONS_TEST_IDS, type ErrorMeaning, ERRORS_TEST_IDS } from "../testIds.ts";

Then("I expect to see the {string} error", async function (this: ComplexWorld, errorMeaning: ErrorMeaning) {
  await this.expectLocated(this.accounting.elements.registerTestId(ERRORS_TEST_IDS[errorMeaning])).toBeInViewport();
  await this.expectLocated(
    this.accounting.elements.registerTestId(ERROR_CLOSE_BUTTONS_TEST_IDS[errorMeaning]),
  ).toBeInViewport();
});

Then("I expect not to see the {string} error", async function (this: ComplexWorld, errorMeaning: ErrorMeaning) {
  await this.expectLocated(this.accounting.elements.registerTestId(ERRORS_TEST_IDS[errorMeaning])).not.toBeInViewport();
  await this.expectLocated(
    this.accounting.elements.registerTestId(ERROR_CLOSE_BUTTONS_TEST_IDS[errorMeaning]),
  ).not.toBeInViewport();
});

Then(
  "I expect to see the following number of {string} errors: {int}",
  async function (this: ComplexWorld, errorMeaning: ErrorMeaning, expectedCount: number) {
    await this.expectLocated(this.accounting.elements.registerTestId(ERRORS_TEST_IDS[errorMeaning])).toHaveCount(
      expectedCount,
    );
  },
);
