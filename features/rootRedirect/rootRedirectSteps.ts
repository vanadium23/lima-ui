import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { LISTS } from "../../utilities/addresses.ts";

When("I navigate to the root page", async function () {
  await this.page.goto(this.FRONTEND_ADDRESS + "/");
});

Then("I should be redirected to the Lists page", async function () {
  const finalUrl = await this.page.url();
  expect(finalUrl).toContain(LISTS);
});
