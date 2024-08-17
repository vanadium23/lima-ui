import { Given, Then } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import { NETWORK_ERROR } from "../testIds.ts";
import { INPUT_TEST_IDS, type InputMeaning } from "./testIds.ts";

Given("There is no internet connection", async function (this: ComplexWorld) {
  await this.context.setOffline(true);
});

Then(
  "I expect to see the connection error",
  async function (this: ComplexWorld) {
    await this.expectLocated(NETWORK_ERROR).toBeInViewport();
  },
);

Given("Data server is not available", async function (this: ComplexWorld) {
  await this.context.route("**/lists", (route) => route.abort("failed"));
});

Then(
  "I not expect to see the connection error",
  async function (this: ComplexWorld) {
    await this.expectLocated(NETWORK_ERROR).not.toBeInViewport();
  },
);

Then(
  "I expect to be focused on the {string} input",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    await this.expectLocated(INPUT_TEST_IDS[inputMeaning]).toBeFocused();
  },
);
