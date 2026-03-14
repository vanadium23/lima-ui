import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import { IMPORTED_GROUP, IMPORTED_GROUP_ITEM, IMPORTED_GROUP_NAME_LINK } from "../../testIds.ts";
import { buildTestableSelector } from "../../utilities/buildTestableSelector.ts";

Then("I expect to see {int} imported group(s) in the list", async function (this: ComplexWorld, count: number) {
  await this.expectLocated(IMPORTED_GROUP).toHaveCount(count);
});

Then(
  "I expect to see at least {int} imported item(s) in the first imported group",
  async function (this: ComplexWorld, count: number) {
    const firstImportedGroup = this.locateByIdParts(IMPORTED_GROUP).first();
    const importedItems = firstImportedGroup.locator(buildTestableSelector(IMPORTED_GROUP_ITEM));
    expect(await importedItems.count()).toBeGreaterThanOrEqual(count);
  },
);

Then("I expect the first imported group name to match the first import list name", async function (this: ComplexWorld) {
  const firstImportedGroup = this.locateByIdParts(IMPORTED_GROUP).first();
  const groupNameLink = firstImportedGroup.locator(buildTestableSelector(IMPORTED_GROUP_NAME_LINK));
  const groupName = await groupNameLink.textContent();
  expect(groupName).toBe(this.data["listTitle_0"]);
});
