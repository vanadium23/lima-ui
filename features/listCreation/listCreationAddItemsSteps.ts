import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { ITEMS_LIMIT } from "../../configuration.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  ADD_ITEM_BUTTON,
  ITEM_INPUT,
  ITEM_INPUT_CONTAINER,
  ITEMS_INPUTS,
  ITEMS_LIMIT_REACHED_WARNING,
} from "../testIds.ts";
import { TEST_SUB_ID_ATTRIBUTE } from "../utilities/buildTestableSelector.ts";
import { noVerticalScroll } from "../utilities/checkScroll.ts";

import { BUTTON_TEST_IDS, type ButtonMeaning } from "./testIds.ts";

Then(
  "I press the {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.locateByFullId(BUTTON_TEST_IDS[buttonMeaning]).click();
  },
);

Then(
  "I expect to see second item input ready for typing with the following placeholder: {string}",
  async function (this: ComplexWorld, placeholder: string) {
    const secondItemInput = this.locate(ITEM_INPUT).nth(1);

    const secondItemTestSubId = await secondItemInput.getAttribute(
      TEST_SUB_ID_ATTRIBUTE,
    );
    this.accounting.registerTestIdAndSubId(ITEM_INPUT, secondItemTestSubId);
    this.accounting.registerTestIdAndSubId(
      ITEM_INPUT_CONTAINER,
      secondItemTestSubId,
    );

    const expectSecondItemInput = expect(secondItemInput);

    await expectSecondItemInput.toBeInViewport();
    await expectSecondItemInput.toBeEnabled();
    await expectSecondItemInput.toHaveAttribute("placeholder", placeholder);
  },
);

When(
  "I add items inputs till scroll appears plus one item input",
  async function (this: ComplexWorld) {
    const addItemButton = this.locate(ADD_ITEM_BUTTON);
    const itemsInputs = this.locate(ITEMS_INPUTS);

    while (
      (await itemsInputs.evaluate(noVerticalScroll)) &&
      (await addItemButton.isEnabled())
    ) {
      await addItemButton.click();
    }

    if (await addItemButton.isEnabled()) {
      await addItemButton.click();
    }
  },
);

Then(
  "I expect to see the last added item input",
  async function (this: ComplexWorld) {
    await expect(this.locate(ITEM_INPUT).last()).toBeInViewport();
  },
);

Then("I expect not to see the first item input", async function () {
  await expect(this.locate(ITEM_INPUT).first()).not.toBeInViewport();
});

When(
  "I add items inputs to their limit",
  { timeout: 60000 },
  async function (this: ComplexWorld) {
    const addItemButton = this.locate(ADD_ITEM_BUTTON);

    for (let i = 1; i <= ITEMS_LIMIT - 1; i++) {
      await addItemButton.click();
    }
  },
);

Then(
  "I expect to see the warning about items inputs limit reached",
  async function (this: ComplexWorld) {
    await this.expectLocated(ITEMS_LIMIT_REACHED_WARNING).toBeInViewport();
  },
);
