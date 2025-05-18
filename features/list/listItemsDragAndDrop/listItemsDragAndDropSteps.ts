import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import {
  DRAG_HANDLE,
  DRAGGED_LIST_ITEM,
  LIST_ITEM,
  LIST_ITEMS,
} from "../../testIds.ts";
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
  async function (this: ComplexWorld, left: number, top: number) {
    let leftPosition = left;
    let topPosition = top;

    if (leftPosition < 0) {
      const windowWidth = (this.page.viewportSize() || { width: 0 }).width;

      leftPosition = windowWidth + leftPosition;
    }

    if (topPosition < 0) {
      const windowHeight = (this.page.viewportSize() || { height: 0 }).height;

      topPosition = windowHeight + topPosition;
    }

    await this.page.mouse.move(leftPosition, topPosition, { steps: 10 });
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
  "I drag the item on the {string} item",
  async function (this: ComplexWorld, listItemMeaning: ListItemMeaning) {
    const itemToDragOnBox = await this.locateByFullId(
      LIST_ITEM_TEST_IDS[listItemMeaning],
    ).boundingBox();

    if (!itemToDragOnBox) {
      throw new Error("Could not get bounding box for list items");
    }

    const { x, y } = itemToDragOnBox;

    const viewportSize = this.page.viewportSize();

    if (!viewportSize) {
      throw new Error("Viewport size is not set");
    }

    const rect = {
      x: Math.min(x, viewportSize.width - 1),
      y: Math.min(y, viewportSize.height - 1),
    };

    await this.page.mouse.move(rect.x, rect.y, {
      steps: 10,
    });
  },
);

Then(
  "I expect to see the dragged list item on the {string} position",
  async function (this: ComplexWorld, listItemMeaning: ListItemMeaning) {
    const itemToDragOnValue = await getListItemValue(
      this.locateByFullId(LIST_ITEM_TEST_IDS[listItemMeaning]),
    );

    expect(itemToDragOnValue).toBe(this.data.draggedListItemValue);
  },
);

Then(
  "I expect to see the dragged list item last",
  async function (this: ComplexWorld) {
    const draggedListItemValue = await getListItemValue(
      this.locateByIdParts(LIST_ITEM).last(),
    );

    expect(draggedListItemValue).toBe(this.data.draggedListItemValue);
  },
);

When(
  "I scroll to the bottom of the list items",
  async function (this: ComplexWorld) {
    await this.locateByIdParts(LIST_ITEMS).evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
  },
);
