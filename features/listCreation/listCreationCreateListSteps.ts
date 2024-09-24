import { Then, When } from "@cucumber/cucumber";
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
import { ITEM_INPUT } from "../testIds.ts";
import { getStringUpToLimit } from "../utilities/getStringOfLength.ts";
import { EDIT_LIST_INPUT_LIMIT } from "../../configuration.ts";

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

When(
  "I type some text to all items inputs",
  async function (this: ComplexWorld) {
    const allItemsInputs = await this.locate(ITEM_INPUT).all();

    for (const itemInput of allItemsInputs) {
      await itemInput.fill(getStringUpToLimit(EDIT_LIST_INPUT_LIMIT));
    }
  },
);

Then("I expect all items inputs disabled", async function (this: ComplexWorld) {
  const allItemsInputs = await this.locate(ITEM_INPUT).all();

  for (const itemInput of allItemsInputs) {
    await expect(itemInput).toBeDisabled();
  }
});

Then(
  "I expect not to see the {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.expectLocated(
      BUTTON_TEST_IDS[buttonMeaning],
    ).not.toBeInViewport();
  },
);

When(
  "I start looking at the list creation requests",
  async function (this: ComplexWorld) {
    this.counters.listCreationRequestsNumber = 0;

    this.page.on("request", (data) => {
      if (data.method() === "POST" && data.url().endsWith("/lists")) {
        this.counters.listCreationRequestsNumber++;
      }
    });
  },
);

When(
  "I expect to see the following number of list creation request: {int}",
  async function (
    this: ComplexWorld,
    expectedListCreationRequestsNumber: number,
  ) {
    expect(this.counters.listCreationRequestsNumber).toBe(
      expectedListCreationRequestsNumber,
    );
  },
);

When(
  "I forcefully press the {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.locateByFullId(BUTTON_TEST_IDS[buttonMeaning]).click({
      force: true,
    });
  },
);
