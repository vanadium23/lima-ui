import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import {
  DRAG_HANDLE,
  DRAGGED_LIST_ITEM,
  DRAGGED_LIST_ITEM_INPUT,
  LIST_ITEM_INPUT,
} from "../../testIds.ts";
import { buildTestableSelector } from "../../utilities/buildTestableSelector.ts";

import { LIST_ITEM_TEST_IDS, type ListItemMeaning } from "./testIds.ts";

When(
  "I start dragging the {string} list item",
  async function (this: ComplexWorld, listItemMeaning: ListItemMeaning) {
    const listItem = this.locateByFullId(LIST_ITEM_TEST_IDS[listItemMeaning]);

    this.data.draggedListItemValue = await listItem
      .locator(buildTestableSelector(LIST_ITEM_INPUT))
      .inputValue();

    const dragHandle = listItem.locator(buildTestableSelector(DRAG_HANDLE));
    await listItem.hover();
    await dragHandle.hover();

    await this.page.mouse.down();
    await this.page.mouse.move(50, 50, { steps: 10 });
  },
);

Then(
  "I expect to see the dragged item overlay with item content",
  async function (this: ComplexWorld) {
    const draggedListItem = this.locateByIdParts(DRAGGED_LIST_ITEM);

    const listItemValue = await draggedListItem
      .locator(buildTestableSelector(DRAGGED_LIST_ITEM_INPUT))
      .inputValue();

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
  // Complete the drag by releasing the mouse button
  await this.page.mouse.up();
});
