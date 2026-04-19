import { Then, When } from "@cucumber/cucumber";
import { expect, type Locator } from "@playwright/test";

import { ITEMS_LIMIT, LISTS_LIMIT } from "../../../configuration.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import {
  EXPORTED_TO_LIST_ITEM,
  IMPORT_DIALOG_COUNTER,
  IMPORTED_GROUP,
  IMPORTED_GROUP_ITEM,
  IMPORTED_GROUP_NAME_LINK,
  LIST_ITEM,
  LIST_STRIPE_IMPORT,
} from "../../testIds.ts";
import { buildFullTestId, buildTestableSelector } from "../../utilities/buildTestableSelector.ts";
import { INPUT_TEST_IDS, type InputMeaning } from "../listCreation/testIds.ts";

Then("I expect to see {int} imported group(s) in the list", async function (this: ComplexWorld, count: number) {
  await this.expectLocated(IMPORTED_GROUP).toHaveCount(count);
});

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

Then(
  "I expect the {string} input to match the import list #{int} name",
  async function (this: ComplexWorld, inputMeaning: InputMeaning, listIndex: number) {
    const input = this.locateByFullId(INPUT_TEST_IDS[inputMeaning]);
    await expect(input).toHaveValue(this.data[`listTitle_${listIndex - 1}`] ?? "");
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
  await this.expectLocated(LIST_STRIPE_IMPORT).toHaveCount(LISTS_LIMIT - 1);
});

Then("I expect the import counter to show limit reached", async function (this: ComplexWorld) {
  await this.expectLocated(IMPORT_DIALOG_COUNTER).toHaveText(`${ITEMS_LIMIT}/${ITEMS_LIMIT}`);
});

Then("I expect the import counter to show limit exceeded", async function (this: ComplexWorld) {
  await this.expectLocated(IMPORT_DIALOG_COUNTER).toHaveText(`${ITEMS_LIMIT + 1}/${ITEMS_LIMIT}`);
});

Then("I expect the imported group to be above the first list item", async function (this: ComplexWorld) {
  await expectGroupPosition(this, true);
});

Then("I expect the imported group to be below the first list item", async function (this: ComplexWorld) {
  await expectGroupPosition(this, false);
});

async function expectGroupPosition(complexWorld: ComplexWorld, isAbove: boolean) {
  const importedGroupIndex = await getDomIndex(complexWorld.locateByIdParts(IMPORTED_GROUP).first());
  const firstListItemIndex = await getDomIndex(complexWorld.locateByIdParts(LIST_ITEM).first());

  expect(importedGroupIndex).toBe(isAbove ? firstListItemIndex - 1 : firstListItemIndex + 1);
}

async function getDomIndex(element: Locator): Promise<number> {
  return element.evaluate((el) => {
    const parent = el.parentElement;
    if (!parent) return -1;

    return Array.from(parent.children).indexOf(el);
  });
}

const EXPORTED_TO_LIST_ITEM_TEST_IDS = {
  "first exported to list": buildFullTestId(EXPORTED_TO_LIST_ITEM, 0),
  "second exported to list": buildFullTestId(EXPORTED_TO_LIST_ITEM, 1),
  "third exported to list": buildFullTestId(EXPORTED_TO_LIST_ITEM, 2),
};

type ExportedToListItemMeaning = keyof typeof EXPORTED_TO_LIST_ITEM_TEST_IDS;

When(
  "I press the {string} in the exported to list",
  async function (this: ComplexWorld, listItemMeaning: ExportedToListItemMeaning) {
    const listItem = this.locateByFullId(EXPORTED_TO_LIST_ITEM_TEST_IDS[listItemMeaning]);
    const link = listItem.locator("a");

    await link.click();
  },
);

Then("I expect to see {int} list(s) in the exported to dropdown", async function (this: ComplexWorld, count: number) {
  await this.expectLocated(EXPORTED_TO_LIST_ITEM).toHaveCount(count);
});

Then(
  "I expect the {string} to contain the text of the {string} list name",
  async function (this: ComplexWorld, listItemMeaning: ExportedToListItemMeaning, listTitleKey: string) {
    await this.expectLocated(EXPORTED_TO_LIST_ITEM_TEST_IDS[listItemMeaning]).toHaveText(this.data[listTitleKey] ?? "");
  },
);

When("I hover the first imported group", async function (this: ComplexWorld) {
  await this.locateByIdParts(IMPORTED_GROUP).first().hover();
});

Then("I expect to see {int} item(s) in the first imported group", async function (this: ComplexWorld, count: number) {
  const firstImportedGroup = this.locateByIdParts(IMPORTED_GROUP).first();
  const importedItems = firstImportedGroup.locator(buildTestableSelector(IMPORTED_GROUP_ITEM));

  expect(await importedItems.count()).toBe(count);
});

Then(
  "I expect the first item in the first imported group to contain the text from {string} input",
  async function (this: ComplexWorld, inputMeaning: string) {
    const firstImportedGroup = this.locateByIdParts(IMPORTED_GROUP).first();
    const firstItem = firstImportedGroup.locator(buildTestableSelector(IMPORTED_GROUP_ITEM)).first();
    const expectedText = this.data[inputMeaning];

    await expect(firstItem).toHaveText(expectedText!);
  },
);

Then("I expect the list item to be above the first imported group", async function (this: ComplexWorld) {
  await expectListItemPosition(this, true);
});

Then("I expect the list item to be below the first imported group", async function (this: ComplexWorld) {
  await expectListItemPosition(this, false);
});

Then("I expect the second imported group to be above the first imported group", async function (this: ComplexWorld) {
  await expectSecondImportedGroupPosition(this, true);
});

Then("I expect the second imported group to be below the first imported group", async function (this: ComplexWorld) {
  await expectSecondImportedGroupPosition(this, false);
});

async function expectListItemPosition(complexWorld: ComplexWorld, isAbove: boolean) {
  const listItems = complexWorld.locateByIdParts(LIST_ITEM);
  const lastListItemIndex = await getDomIndex(listItems.last());
  const importedGroupIndex = await getDomIndex(complexWorld.locateByIdParts(IMPORTED_GROUP).first());

  expect(lastListItemIndex).toBe(isAbove ? importedGroupIndex - 1 : importedGroupIndex + 1);
}

async function expectSecondImportedGroupPosition(complexWorld: ComplexWorld, isAbove: boolean) {
  const firstGroupIndex = await getDomIndex(complexWorld.locateByIdParts(IMPORTED_GROUP).first());
  const secondGroupIndex = await getDomIndex(complexWorld.locateByIdParts(IMPORTED_GROUP).nth(1));

  expect(isAbove ? firstGroupIndex : secondGroupIndex).toBe(isAbove ? secondGroupIndex - 1 : firstGroupIndex + 1);
}
