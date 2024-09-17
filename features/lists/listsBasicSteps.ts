import { Then, When } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  ADD_GROUP_BUTTON,
  CREATE_LIST_BUTTON,
  NO_SAVED_LISTS_MESSAGE,
  PAGE_TITLE,
  PRO_VERSION_BUTTON,
  SIDEBAR,
} from "../testIds.ts";

When("I clear all data", async function (this: ComplexWorld) {
  await this.request("clear-database", "POST");
});

When("I open Lists page", async function (this: ComplexWorld) {
  await this.navigate("lists");
});

Then(
  "All elements expected to be on the Lists page right after opening are here",
  async function (this: ComplexWorld) {
    this.accounting.registerSeveralTestIds([
      SIDEBAR,
      ADD_GROUP_BUTTON,
      PRO_VERSION_BUTTON,
      PAGE_TITLE,
      NO_SAVED_LISTS_MESSAGE,
      CREATE_LIST_BUTTON,
    ]);
  },
);
