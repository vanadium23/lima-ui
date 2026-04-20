import { When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../../context/hooks.ts";
import { SAVE_LIST_BUTTON } from "../../testIds.ts";

When("I wait for the list update to complete", async function (this: ComplexWorld) {
  await this.expectLocated(SAVE_LIST_BUTTON).toContainClass("button_disabled");
});
