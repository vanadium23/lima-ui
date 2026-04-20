import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import { IMPORTED_GROUP, IMPORTED_GROUP_ITEM } from "../../testIds.ts";
import { buildTestableSelector } from "../../utilities/buildTestableSelector.ts";

Then(
  "I expect the item #{int} in the first imported group to contain the following text: {string}",
  async function (this: ComplexWorld, itemPosition: number, text: string) {
    const firstImportedGroup = this.locateByIdParts(IMPORTED_GROUP).first();
    const item = firstImportedGroup.locator(buildTestableSelector(IMPORTED_GROUP_ITEM)).nth(itemPosition - 1);

    await expect(item).toHaveText(text);
  },
);
