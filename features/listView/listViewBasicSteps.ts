import { Then } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { LIST_TITLE_INPUT } from "../testIds.ts";

Then("I expect to see list title input", async function (this: ComplexWorld) {
  const expectPageTitle = this.expectLocated(LIST_TITLE_INPUT);
  await expectPageTitle.toBeInViewport();
  await expectPageTitle.toHaveValue(this.data[LIST_TITLE_INPUT] || "");
});
