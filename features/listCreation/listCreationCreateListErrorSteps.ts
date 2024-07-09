import { Given, Then } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import { NETWORK_ERROR } from "../testIds.ts";

Given("There is no internet connection", async function (this: ComplexWorld) {
  await this.context.setOffline(true);
});

Then(
  "I expect to see the connection error",
  async function (this: ComplexWorld) {
    await this.expectLocated(NETWORK_ERROR).toBeInViewport();
  },
);
