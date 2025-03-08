import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { EDIT_LIST_INPUT_LIMIT } from "../../configuration.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import { ITEM_INPUT } from "../testIds.ts";
import {
  ADDRESSES_MEANINGS,
  SOME_LIST,
  type AddressMeaning,
} from "../utilities/addresses.ts";
import { getStringUpToLimit } from "../utilities/getStringOfLength.ts";

import {
  ACCORDION_TEST_IDS,
  type AccordionMeaning,
  BUTTON_TEST_IDS,
  type ButtonMeaning,
  INPUT_TEST_IDS,
  type InputMeaning,
  TEXT_AREA_TEST_IDS,
  type TextAreaMeaning,
} from "./testIds.ts";

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
  "I start counting the {string} requests",
  async function (this: ComplexWorld, requestMeaning: AddressMeaning) {
    this.counters[requestMeaning] = 0;

    this.page.on("request", (data) => {
      const { address, method } = ADDRESSES_MEANINGS[requestMeaning];

      if (data.url().endsWith(address) && data.method() === method) {
        if (this.counters[requestMeaning] !== undefined) {
          this.counters[requestMeaning]++;
        }
      }
    });
  },
);

When(
  "I expect to see the following number of {string} request: {int}",
  async function (
    this: ComplexWorld,
    requestMeaning: string,
    expectedListCreationRequestsNumber: number,
  ) {
    expect(this.counters[requestMeaning]).toBe(
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

When(
  "I wait for the list to create",
  async function (this: ComplexWorld) {
    await this.page.waitForURL(`**/${SOME_LIST}`);
  },
);

Then(
  "I expect to see {string} input with the text I provided",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    const expectedText = this.data[inputMeaning] || "";
    await this.expectLocated(INPUT_TEST_IDS[inputMeaning]).toHaveValue(expectedText);
  }
);

Then(
  "I expect to see {string} text area with the text I provided",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    const expectedText = this.data[textAreaMeaning] || "";
    await this.expectLocated(TEXT_AREA_TEST_IDS[textAreaMeaning]).toHaveValue(expectedText);
  }
);

When(
  "I refresh the page",
  async function (this: ComplexWorld) {
    await this.page.reload();
  }
);

When(
  "I wait for the page to load",
  async function (this: ComplexWorld) {
    await this.page.waitForLoadState("networkidle");
  }
);
