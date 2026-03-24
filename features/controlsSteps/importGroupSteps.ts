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
