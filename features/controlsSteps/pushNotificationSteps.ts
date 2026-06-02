import { Then } from "@cucumber/cucumber";

import type { TestId } from "../../src/components/utilities/testable.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  IMPORT_ERROR,
  IMPORT_ERROR_CLOSE_BUTTON,
  LIMIT_EXCEEDED_ERROR,
  LIMIT_EXCEEDED_ERROR_CLOSE_BUTTON,
  LIST_REMOVAL_ERROR,
  LIST_REMOVAL_ERROR_CLOSE_BUTTON,
  NETWORK_ERROR,
  NETWORK_ERROR_CLOSE_BUTTON,
} from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";

const ERRORS_TEST_IDS = {
  connection: NETWORK_ERROR,
  "single connection": buildFullTestId(NETWORK_ERROR, 1),
  "single list removal": buildFullTestId(LIST_REMOVAL_ERROR, 1),
  import: IMPORT_ERROR,
  "single import": buildFullTestId(IMPORT_ERROR, 1),
  "limit exceeded": LIMIT_EXCEEDED_ERROR,
};

type ErrorMeaning = keyof typeof ERRORS_TEST_IDS;

const ERROR_CLOSE_BUTTONS_TEST_IDS: Record<ErrorMeaning, TestId> = {
  connection: NETWORK_ERROR_CLOSE_BUTTON,
  "single connection": buildFullTestId(NETWORK_ERROR_CLOSE_BUTTON, 1),
  "single list removal": buildFullTestId(LIST_REMOVAL_ERROR_CLOSE_BUTTON, 1),
  import: IMPORT_ERROR_CLOSE_BUTTON,
  "single import": buildFullTestId(IMPORT_ERROR_CLOSE_BUTTON, 1),
  "limit exceeded": LIMIT_EXCEEDED_ERROR_CLOSE_BUTTON,
};

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
