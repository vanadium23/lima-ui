import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import { INPUT_TEST_IDS, type InputMeaning, SWITCH_TEST_IDS, type SwitchMeaning } from "../listCreation/testIds.ts";
import { ITEM_INPUT, ITEM_INPUT_CONTAINER } from "../testIds.ts";
import { TEST_SUB_ID_ATTRIBUTE } from "../utilities/buildTestableSelector.ts";

Then("I expect to see {string} input enabled", async function (this: ComplexWorld, inputMeaning: InputMeaning) {
  const expectInput = this.expectLocated(
    this.accounting.registerTestId(INPUT_TEST_IDS[inputMeaning])
  );
  
  await expectInput.toBeInViewport();
  await expectInput.toBeEnabled();
});

Then("I expect to see the {string} switch enabled", async function (this: ComplexWorld, switchMeaning: SwitchMeaning) {
  const switchElement = this.locate(
    this.accounting.registerTestId(SWITCH_TEST_IDS[switchMeaning])
  );
  
  await expect(switchElement).toBeInViewport();
  await expect(switchElement.locator("input")).toBeEnabled();
});

Then(
  "I expect to see {int} item inputs ready for typing",
  async function (this: ComplexWorld, count: number) {
    const itemInputs = this.locate(ITEM_INPUT);

    expect(itemInputs).toHaveCount(count);

    for (const itemInput of await itemInputs.all()) {
      const itemInputTestSubId = await itemInput.getAttribute(
        TEST_SUB_ID_ATTRIBUTE,
      );
      this.accounting.registerTestIdAndSubId(ITEM_INPUT, itemInputTestSubId);
      this.accounting.registerTestIdAndSubId(
        ITEM_INPUT_CONTAINER,
        itemInputTestSubId,
      );

      await expect(itemInput).toBeInViewport();
      await expect(itemInput).toBeEnabled();
    }
  },
);
