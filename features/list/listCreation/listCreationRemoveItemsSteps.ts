import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../../context/hooks.ts";
import { ITEMS_LIMIT_REACHED_WARNING, LIST_ITEM } from "../../testIds.ts";
import { TEST_SUB_ID_ATTRIBUTE } from "../../utilities/buildTestableSelector.ts";
import { getTimeoutOrCancelItIfDebugging } from "../../utilities/getTimeoutOrCancelItIfDebugging.ts";
import { getRandomInt } from "../utilities/getRandomInt.ts";

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
  { timeout: getTimeoutOrCancelItIfDebugging(10000) },
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
    await this.expectLocated(
      this.accounting.elements.registerTestId(INPUT_TEST_IDS[inputMeaning]),
    ).toBeDisabled();
  },
);

Then(
  "I expect to see the only one list item left on the page",
  async function (this: ComplexWorld) {
    await expect(this.locateByIdParts(LIST_ITEM)).toHaveCount(1);
  },
);

When(
  "I hover {string} input",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    await this.locateByFullId(INPUT_TEST_IDS[inputMeaning]).hover();
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
    const inputId = INPUT_TEST_IDS[inputMeaning];
    let input = this.locateByFullId(inputId);

    if (inputMeaning === "last item") {
      input = this.locateByIdParts(inputId).last();

      this.numbers.lastItemIndex = parseInt(
        (await input.getAttribute(TEST_SUB_ID_ATTRIBUTE)) || "-1",
      );
    }

    if (inputMeaning === "some item") {
      const numberOfInputs = await this.locateByIdParts(inputId).count();

      input = this.locateByIdParts(inputId).nth(getRandomInt(numberOfInputs));
    }

    await input.focus();
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
