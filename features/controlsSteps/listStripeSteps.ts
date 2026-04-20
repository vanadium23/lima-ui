import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import { EXPORTED_TO_MARK, LIST_STRIPE } from "../testIds.ts";
import { buildTestableSelector } from "../utilities/buildTestableSelector.ts";

export const LIST_STRIPE_POSITIONS = {
  first: 0,
  second: 1,
};

export type ListStripePosition = keyof typeof LIST_STRIPE_POSITIONS;

When(
  "I press on the {string} list stripe",
  async function (this: ComplexWorld, listStripePosition: ListStripePosition) {
    await this.locateByIdParts(LIST_STRIPE).nth(LIST_STRIPE_POSITIONS[listStripePosition]).click();
  },
);

Then(
  "I expect the {string} list stripe to be marked as exported",
  async function (this: ComplexWorld, listStripePosition: ListStripePosition) {
    const listStripe = this.locateByIdParts(LIST_STRIPE, LIST_STRIPE_POSITIONS[listStripePosition]);

    await expect(listStripe.locator(buildTestableSelector(EXPORTED_TO_MARK))).toBeInViewport();
  },
);

Then(
  "I expect the {string} list stripe to not be marked as exported",
  async function (this: ComplexWorld, listStripePosition: ListStripePosition) {
    const listStripe = this.locateByIdParts(LIST_STRIPE).nth(LIST_STRIPE_POSITIONS[listStripePosition]);

    await expect(listStripe.locator(buildTestableSelector(EXPORTED_TO_MARK))).not.toBeInViewport();
  },
);
