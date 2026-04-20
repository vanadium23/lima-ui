import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import { DRAG_HANDLE, IMPORTED_GROUP, IMPORTED_GROUP_NAME_LINK } from "../../testIds.ts";
import { buildTestableSelector } from "../../utilities/buildTestableSelector.ts";

const IMPORTED_GROUP_POSITIONS = {
  first: 0,
  second: 1,
  third: 2,
  fourth: 3,
};

type ImportedGroupPosition = keyof typeof IMPORTED_GROUP_POSITIONS;

When(
  "I start dragging the {string} imported group",
  async function (this: ComplexWorld, position: ImportedGroupPosition) {
    const importedGroup = this.locateByIdParts(IMPORTED_GROUP, IMPORTED_GROUP_POSITIONS[position]);

    await importedGroup.scrollIntoViewIfNeeded();

    this.data.draggedImportedGroupName = await getImportedGroupName(importedGroup);

    const dragHandle = importedGroup.locator(buildTestableSelector(DRAG_HANDLE));
    await importedGroup.hover();
    await dragHandle.hover();

    await this.page.mouse.down();
  },
);

When(
  "I drag the imported group on the {string} imported group",
  async function (this: ComplexWorld, position: ImportedGroupPosition) {
    const targetGroup = this.locateByIdParts(IMPORTED_GROUP, IMPORTED_GROUP_POSITIONS[position]);

    const targetBox = await targetGroup.boundingBox();

    if (!targetBox) {
      throw new Error("Could not get bounding box for imported group");
    }

    const viewportSize = this.page.viewportSize();

    if (!viewportSize) {
      throw new Error("Viewport size is not set");
    }

    await this.page.mouse.move(
      Math.min(targetBox.x, viewportSize.width - 1),
      Math.min(targetBox.y, viewportSize.height - 1),
      { steps: 10 },
    );
  },
);

Then(
  "I expect to see the dragged imported group on the {string} position",
  async function (this: ComplexWorld, position: ImportedGroupPosition) {
    const importedGroup = this.locateByIdParts(IMPORTED_GROUP, IMPORTED_GROUP_POSITIONS[position]);

    expect(await getImportedGroupName(importedGroup)).toBe(this.data.draggedImportedGroupName);
  },
);

async function getImportedGroupName(importedGroup: ReturnType<ComplexWorld["locateByIdParts"]>) {
  const nameLink = importedGroup.locator(buildTestableSelector(IMPORTED_GROUP_NAME_LINK));

  return (await nameLink.textContent()) ?? "";
}
