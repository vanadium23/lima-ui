import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import { IMPORTED_GROUP, IMPORTED_GROUP_ITEM } from "../testIds.ts";
import { buildTestableSelector } from "../utilities/buildTestableSelector.ts";

Then(
  "I expect the first item in the first imported group to contain the following text: {string}",
  async function (this: ComplexWorld, text: string) {
    const firstImportedGroup = this.locateByIdParts(IMPORTED_GROUP).first();
    const firstItem = firstImportedGroup.locator(buildTestableSelector(IMPORTED_GROUP_ITEM));

    await expect(firstItem).toHaveText(text);
  },
);

Then(
  "I expect to see {int} item(s) in the imported group #{int}",
  async function (this: ComplexWorld, count: number, groupIndex: number) {
    const importedGroup = this.locateByIdParts(IMPORTED_GROUP).nth(groupIndex - 1);
    const importedItems = importedGroup.locator(buildTestableSelector(IMPORTED_GROUP_ITEM));

    await expect(importedItems).toHaveCount(count);
  },
);

Then(
  "I expect the item #{int} in the imported group #{int} to contain the following text: {string}",
  async function (this: ComplexWorld, itemPosition: number, groupIndex: number, text: string) {
    const importedGroup = this.locateByIdParts(IMPORTED_GROUP).nth(groupIndex - 1);
    const item = importedGroup.locator(buildTestableSelector(IMPORTED_GROUP_ITEM)).nth(itemPosition - 1);

    await expect(item).toHaveText(text);
  },
);
