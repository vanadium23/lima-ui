import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import {
  INPUT_TEST_IDS,
  type InputMeaning,
  MENUITEM_TEST_IDS,
  type MenuitemMeaning,
} from "../listCreation/testIds.ts";

When(
  "I press the visible {string} menu item",
  async function (this: ComplexWorld, menuItemMeaning: MenuitemMeaning) {
    const menuItem = this.locateVisible(
      `${MENUITEM_TEST_IDS[menuItemMeaning]}`,
    );
    await menuItem.click();
  },
);

Then(
  "I expect not to see the {string} input with the text I provided",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    const inputLocator = this.locateByFullId(INPUT_TEST_IDS[inputMeaning]);
    const expectedText = this.data[inputMeaning];

    const isVisible = await inputLocator.isVisible();

    if (isVisible) {
      const inputValue = await inputLocator.inputValue();
      expect(inputValue).not.toEqual(expectedText);
    } else {
      expect(isVisible).toBeFalsy();
    }
  },
);

When(
  "I type the text that was in the removed {string} input",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    const inputLocator = this.locateByFullId(INPUT_TEST_IDS[inputMeaning]);
    const textToType = this.data[inputMeaning] || "";

    await inputLocator.fill(textToType);
  },
);
