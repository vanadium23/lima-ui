import { Then, When } from "@cucumber/cucumber";

import { LISTS } from "../../utilities/addresses.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import { NO_SAVED_LISTS_MESSAGE } from "../testIds.ts";

When("I clear all data", async function (this: ComplexWorld) {
  await this.request("/clear-database", "POST");
});

When("I open Lists page", async function (this: ComplexWorld) {
  await this.navigate(LISTS);
});

Then(
  "I expect to see the message about lists absence",
  async function (this: ComplexWorld) {
    await this.expectLocated(
      this.accounting.registerTestId(NO_SAVED_LISTS_MESSAGE),
    ).toBeInViewport();
  },
);
