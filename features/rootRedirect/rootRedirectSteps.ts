import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { URL_AUTH } from "../../utilities/addresses.ts";

When("I navigate to the root page", async function () {
  await this.page.goto(this.FRONTEND_ADDRESS + "/");
});

Then("I should be redirected to the Auth page", async function () {
  const finalUrl = await this.page.url();
  expect(finalUrl).toContain(URL_AUTH);
});
