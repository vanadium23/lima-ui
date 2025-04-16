import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import { INPUT_TEST_IDS, type InputMeaning } from "../listCreation/testIds.ts";

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
