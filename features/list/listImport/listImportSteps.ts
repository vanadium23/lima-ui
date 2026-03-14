import { Then, When } from "@cucumber/cucumber";
import { expect, type Locator } from "@playwright/test";

import { ITEMS_LIMIT, LISTS_LIMIT } from "../../../configuration.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import {
  IMPORT_DIALOG_COUNTER,
  IMPORT_DIALOG_LIST,
  IMPORTED_GROUP,
  IMPORTED_GROUP_ITEM,
  IMPORTED_GROUP_NAME_LINK,
  LIST_ITEM,
} from "../../testIds.ts";
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
  const importedGroupName = await getImportedGroupName(this, 0);
  expect(importedGroupName).toBe(this.data["listTitle_0"]);
});

Then(
  "I expect the imported group #{int} name to match the import list #{int} name",
  async function (this: ComplexWorld, groupIndex: number, listIndex: number) {
    const importedGroupName = await getImportedGroupName(this, groupIndex - 1);
    expect(importedGroupName).toBe(this.data[`listTitle_${listIndex - 1}`]);
  },
);

async function getImportedGroupName(complexWorld: ComplexWorld, index: number): Promise<string | null> {
  const importedGroup = complexWorld.locateByIdParts(IMPORTED_GROUP).nth(index);
  const groupNameLink = importedGroup.locator(buildTestableSelector(IMPORTED_GROUP_NAME_LINK));

  return groupNameLink.textContent();
}

When("I press the first imported group name link", async function (this: ComplexWorld) {
  const firstImportedGroup = this.locateByIdParts(IMPORTED_GROUP).first();
  const groupNameLink = firstImportedGroup.locator(buildTestableSelector(IMPORTED_GROUP_NAME_LINK));

  await groupNameLink.click();
});

Then("I expect to see all other lists in the import dialog", async function (this: ComplexWorld) {
  await this.expectLocated(IMPORT_DIALOG_LIST).toHaveCount(LISTS_LIMIT - 1);
});

Then("I expect the import counter to show limit reached", async function (this: ComplexWorld) {
  await this.expectLocated(IMPORT_DIALOG_COUNTER).toHaveText(`${ITEMS_LIMIT}/${ITEMS_LIMIT}`);
});

Then("I expect the import counter to show limit exceeded", async function (this: ComplexWorld) {
  await this.expectLocated(IMPORT_DIALOG_COUNTER).toHaveText(`${ITEMS_LIMIT + 1}/${ITEMS_LIMIT}`);
});

Then("I expect the imported group to be above the first list item", async function (this: ComplexWorld) {
  const importedGroupIndex = await getDomIndex(this.locateByIdParts(IMPORTED_GROUP).first());
  const firstListItemIndex = await getDomIndex(this.locateByIdParts(LIST_ITEM).first());

  expect(importedGroupIndex).toBeLessThan(firstListItemIndex);
});

async function getDomIndex(element: Locator): Promise<number> {
  return element.evaluate((el) => {
    const parent = el.parentElement;
    if (!parent) return -1;

    return Array.from(parent.children).indexOf(el);
  });
}
