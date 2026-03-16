import { When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { LIST_STRIPE } from "../testIds.ts";

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
