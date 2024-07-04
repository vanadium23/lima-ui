import { Then } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  ACCORDION_TEST_IDS,
  type AccordionMeaning,
  BUTTON_TEST_IDS,
  type ButtonMeaning,
  TEXT_AREA_TEST_IDS,
  type TextAreaMeaning,
} from "./testIds.ts";
import { expect } from "@playwright/test";

Then(
  "I expect to see the {string} accordion disabled",
  async function (this: ComplexWorld, accordionMeaning: AccordionMeaning) {
    await expect(
      this.locate(ACCORDION_TEST_IDS[accordionMeaning]).locator("button"),
    ).toBeDisabled();
  },
);

Then(
  "I expect to see the {string} text area disabled",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    await this.expectLocated(
      TEXT_AREA_TEST_IDS[textAreaMeaning],
    ).toBeDisabled();
  },
);

Then(
  "I expect to see the {string} button in the loading state",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await expect(
      this.locate(BUTTON_TEST_IDS[buttonMeaning]).locator("svg"),
    ).toBeInViewport();
  },
);
