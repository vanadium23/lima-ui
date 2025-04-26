import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import {
  BUTTON_TEST_IDS,
  type ButtonMeaning,
} from "../list/listCreation/testIds.ts";
import { TOOLS_PANEL_ADD_ITEM_BUTTON } from "../testIds.ts";

/* Basic actions */

Then(
  "I press the {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.locateByFullId(BUTTON_TEST_IDS[buttonMeaning]).click();
  },
);

When(
  "I hover {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.locateByFullId(BUTTON_TEST_IDS[buttonMeaning]).hover();
  },
);

When(
  "I focus {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.locateByFullId(BUTTON_TEST_IDS[buttonMeaning]).focus();
  },
);

/* Checks */

Then(
  "I expect to see the {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.expectLocated(BUTTON_TEST_IDS[buttonMeaning]).toBeInViewport();
  },
);

/* State checks */

Then(
  "I expect to see the {string} button disabled",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    const buttonFullTestId = this.accounting.elements.registerTestId(
      BUTTON_TEST_IDS[buttonMeaning],
    );

    if (buttonFullTestId === TOOLS_PANEL_ADD_ITEM_BUTTON) {
      this.accounting.itemAdders.registerTestId(TOOLS_PANEL_ADD_ITEM_BUTTON);
    }

    const element = this.locateByFullId(buttonFullTestId);
    const isButton = await element.evaluate(
      (el) => el.tagName.toLowerCase() === "button",
    );

    if (isButton) {
      await expect(element).toBeDisabled();
    } else {
      await expect(element).toHaveAttribute("href", "#");
    }
  },
);

/* Special actions */

When(
  "I press the {string} button {int} times",
  async function (
    this: ComplexWorld,
    buttonMeaning: ButtonMeaning,
    repeatTimes: number,
  ) {
    const button = this.locateByFullId(BUTTON_TEST_IDS[buttonMeaning]);

    for (let i = 0; i < repeatTimes; i++) {
      await button.click();
    }
  },
);
