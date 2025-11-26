import { Given, Then } from "@cucumber/cucumber";

import type { ComplexWorld } from "../../context/hooks.ts";

import { INPUT_TEST_IDS, type InputMeaning } from "./testIds.ts";

Given("There is no internet connection", async function (this: ComplexWorld) {
  await this.context.setOffline(true);
});

Given("Data server is not available", async function (this: ComplexWorld) {
  await this.context.route(`${this.BACKEND_ADDRESS}/**`, (route) => route.abort("failed"));
});

Then("I expect to be focused on the {string} input", async function (this: ComplexWorld, inputMeaning: InputMeaning) {
  await this.expectLocated(INPUT_TEST_IDS[inputMeaning]).toBeFocused();
});
