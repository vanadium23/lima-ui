import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import {
  ITEM_INPUT,
  ITEMS_LIMIT_REACHED_WARNING,
  REMOVE_ITEM_BUTTON,
} from "../testIds.ts";

import {
  BUTTON_TEST_IDS,
  type ButtonMeaning,
  ELEMENT_TEST_IDS,
  type ElementMeaning,
  INPUT_TEST_IDS,
  type InputMeaning,
} from "./testIds.ts";

const MILLISECONDS_IN_SECOND = 1000;

When(
  "I wait for {string} for the following number of seconds: {int}",
  { timeout: 10000 },
  async function (this: ComplexWorld, reason: string, seconds: number) {
    const someExtraTimeToEnsure =
      Math.floor(Math.random() * MILLISECONDS_IN_SECOND) + reason.length;

    await this.page.waitForTimeout(
      seconds * MILLISECONDS_IN_SECOND + someExtraTimeToEnsure,
    );
  },
);

Then(
  "I expect to see the {string} input disabled",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    await this.expectLocated(INPUT_TEST_IDS[inputMeaning]).toBeDisabled();
  },
);

Then(
  "I expect to see the only one item input left on the page",
  async function (this: ComplexWorld) {
    await expect(this.locate(REMOVE_ITEM_BUTTON)).toHaveCount(1);
  },
);

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

Then(
  "I expect to see {int} items inputs ready for typing",
  async function (this: ComplexWorld, itemsInputsQuantity: number) {
    const itemsInputs = this.locate(ITEM_INPUT);

    await expect(itemsInputs).toHaveCount(itemsInputsQuantity);

    for (const itemInput of await itemsInputs.all()) {
      await expect(itemInput).toBeEnabled();
    }
  },
);

When(
  "I hover {string} input",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    await this.locateByFullId(INPUT_TEST_IDS[inputMeaning]).hover();
  },
);

Then(
  "I expect to see the {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.expectLocated(BUTTON_TEST_IDS[buttonMeaning]).toBeInViewport();
  },
);

When(
  "I hover {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.locateByFullId(BUTTON_TEST_IDS[buttonMeaning]).hover();
  },
);

When(
  "I hover {string}",
  async function (this: ComplexWorld, elementMeaning: ElementMeaning) {
    await this.locateByFullId(ELEMENT_TEST_IDS[elementMeaning]).hover();
  },
);

When(
  "I focus {string} input",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    await this.locateByFullId(INPUT_TEST_IDS[inputMeaning]).focus();
  },
);

When(
  "I focus {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.locateByFullId(BUTTON_TEST_IDS[buttonMeaning]).focus();
  },
);

Then(
  "I expect to see the {string} button disabled",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.expectLocated(
      this.accounting.registerTestId(BUTTON_TEST_IDS[buttonMeaning]),
    ).toBeDisabled();
  },
);

Then(
  "I expect not to see the warning about items inputs limit reached",
  async function (this: ComplexWorld) {
    await this.expectLocated(ITEMS_LIMIT_REACHED_WARNING).not.toBeVisible();
  },
);

When(
  "I hover {string} and press the {string} button",
  async function (
    this: ComplexWorld,
    elementMeaning: ElementMeaning,
    buttonMeaning: ButtonMeaning,
  ) {
    await this.locateByFullId(ELEMENT_TEST_IDS[elementMeaning]).hover();
    await this.locateByFullId(BUTTON_TEST_IDS[buttonMeaning]).click();
  },
);
