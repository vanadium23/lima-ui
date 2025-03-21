import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { LISTS } from "../../utilities/addresses.ts";
import type { ComplexWorld } from "../context/hooks.ts";

Then("I expect to be on the Lists page", async function (this: ComplexWorld) {
  expect(this.page).toHaveURL(new RegExp(LISTS));
});
