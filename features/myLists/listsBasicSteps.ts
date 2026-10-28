import { Then, When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { NO_SAVED_LISTS_MESSAGE } from "../testIds.ts";

When("I clear all data", async function (this: ComplexWorld) {
  await this.request("/api/clear-lists-and-items", "POST");
});

Then("I expect to see the message about lists absence", async function (this: ComplexWorld) {
  await this.expectLocated(this.accounting.elements.registerTestId(NO_SAVED_LISTS_MESSAGE)).toBeInViewport();
});
