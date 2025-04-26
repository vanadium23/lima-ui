import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import { LIST_ITEM, LIST_ITEM_INPUT } from "../../testIds.ts";

When(
  "I fill empty items inputs with their index",
  async function (this: ComplexWorld) {
    const itemInputs = this.locate(LIST_ITEM_INPUT);
    const count = await itemInputs.count();

    this.itemsValues = [];

    for (let i = 0; i < count; i++) {
      const input = itemInputs.nth(i);
      let currentValue = (await input.inputValue()) || "";

      if (!currentValue) {
        currentValue = `Item ${i + 1}`;
        await input.fill(currentValue);
      }

      this.itemsValues.push(currentValue);
    }
  },
);

When(
  "I expect all items inputs to have the same text after saving",
  async function (this: ComplexWorld) {
    const itemInputs = this.locate(LIST_ITEM_INPUT);
    const count = await itemInputs.count();

    const verificationCount = Math.min(count, this.itemsValues.length);

    for (let i = 0; i < verificationCount; i++) {
      const input = itemInputs.nth(i);
      const actualValue = await input.inputValue();
      const expectedValue = this.itemsValues[i];

      expect(actualValue).toEqual(expectedValue);
    }
  },
);

Then(
  "I expect the number of items to remain the same",
  async function (this: ComplexWorld) {
    const items = this.locate(LIST_ITEM);

    expect(await items.count()).toEqual(this.itemsValues.length);
  },
);
