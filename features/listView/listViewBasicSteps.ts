import { Then } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import { LIST_TITLE_INPUT, PAGE_TITLE } from "../testIds.ts";

Then("I expect to see list title", async function (this: ComplexWorld) {
  const expectPageTitle = this.expectLocated(PAGE_TITLE);
  await expectPageTitle.toBeInViewport();
  await expectPageTitle.toHaveText(this.data[LIST_TITLE_INPUT] || "");
});
