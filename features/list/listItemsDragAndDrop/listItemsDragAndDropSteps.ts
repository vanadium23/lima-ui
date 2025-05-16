import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import { DRAG_HANDLE, DRAGGED_LIST_ITEM } from "../../testIds.ts";
import { buildTestableSelector } from "../../utilities/buildTestableSelector.ts";
import { getListItemValue } from "../utilities/getListItemValue.ts";

import { LIST_ITEM_TEST_IDS, type ListItemMeaning } from "./testIds.ts";

When(
  "I start dragging the {string} list item",
  async function (this: ComplexWorld, listItemMeaning: ListItemMeaning) {
    const listItem = this.locateByFullId(LIST_ITEM_TEST_IDS[listItemMeaning]);

    this.data.draggedListItemValue = await getListItemValue(listItem);

    const dragHandle = listItem.locator(buildTestableSelector(DRAG_HANDLE));
    await listItem.hover();
    await dragHandle.hover();

    await this.page.mouse.down();
  },
);

When(
  "I drag to {int} from left and {int} from top",
  async function (this: ComplexWorld, x: number, y: number) {
    await this.page.mouse.move(x, y, { steps: 10 });
  },
);

Then(
  "I expect to see the dragged item overlay with item content",
  async function (this: ComplexWorld) {
    const draggedListItem = this.locateByIdParts(DRAGGED_LIST_ITEM);

    const listItemValue = await getListItemValue(draggedListItem);

    await expect(draggedListItem).toBeInViewport();
    expect(listItemValue).toContain(this.data.draggedListItemValue);
  },
);

Then(
  "I expect to see the drop indicator showing where the item will be placed",
  async function (this: ComplexWorld) {
    const dropIndicator = this.page.locator(".listItem_dragging");

    await expect(dropIndicator).toBeVisible();
  },
);

When("I complete the drag operation", async function (this: ComplexWorld) {
  await this.page.mouse.up();
});

When(
  "I drag the item between the first and second items",
  async function (this: ComplexWorld) {
    const firstItem = this.locateByFullId(LIST_ITEM_TEST_IDS.first);
    const firstItemBox = await firstItem.boundingBox();

    if (!firstItemBox) {
      throw new Error("Could not get bounding box for list items");
    }

    const targetX = firstItemBox.x;
    const targetY = firstItemBox.y + firstItemBox.height + 5;

    await this.page.mouse.move(targetX, targetY, { steps: 10 });
  },
);

Then(
  "I expect to see the previously third list item on the second position",
  async function (this: ComplexWorld) {
    const secondItem = this.locateByFullId(LIST_ITEM_TEST_IDS.second);
    const secondItemValue = await getListItemValue(secondItem);

    expect(secondItemValue).toBe(this.data.draggedListItemValue);
  },
);
