import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import { PRINT_LIST_ITEM } from "../testIds.ts";

Then(
  "I expect to see checkboxes for all list items on the print page",
  async function (this: ComplexWorld) {
    const listItems = this.locate(PRINT_LIST_ITEM);

    expect(await listItems.count()).toBeGreaterThan(0);

    for (const item of await listItems.all()) {
      const hasCheckbox = await item.evaluate((itemElement) => {
        const bulletStyle = window.getComputedStyle(itemElement, "::before");

        return (
          bulletStyle.getPropertyValue("content") === "\"\"" &&
          bulletStyle.getPropertyValue("border").includes("solid") &&
          bulletStyle.getPropertyValue("border").includes("1px")
        );
      });

      expect(hasCheckbox).toBe(true);
    }
  },
);
