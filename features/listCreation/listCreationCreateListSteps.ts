import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { EDIT_LIST_INPUT_LIMIT } from "../../configuration.ts";
import {
  ADDRESSES_MEANINGS,
  type AddressMeaning,
  SOME_LIST,
} from "../../utilities/addresses.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  ITEM_INPUT_TEST_IDS,
  type ItemInputMeaning,
} from "../listAutoItem/testIds.ts";
import {
  buildAccordionButtonTestId,
  buildAccordionContentTestId,
  LIST_ITEM_INPUT,
} from "../testIds.ts";
import { getStringUpToLimit } from "../utilities/getStringOfLength.ts";
import { registerItem } from "../utilities/registerItem.ts";

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
    const accordionTestId = ACCORDION_TEST_IDS[accordionMeaning];

    const accordion = this.locate(
      this.accounting.registerTestId(accordionTestId),
    );

    await expect(accordion).toBeInViewport();
    await expect(accordion.locator("button")).toBeDisabled();

    this.accounting.registerTestId(buildAccordionButtonTestId(accordionTestId));
  },
);

Then(
  "I expect to see the {string} accordion content expanded",
  async function (this: ComplexWorld, accordionMeaning: AccordionMeaning) {
    const accordionTestId = ACCORDION_TEST_IDS[accordionMeaning];
    const accordionContentTestId = buildAccordionContentTestId(accordionTestId);

    await this.expectLocated(
      this.accounting.registerTestId(accordionContentTestId),
    ).toBeInViewport();
  },
);

Then(
  "I expect to see the {string} text area disabled",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    const expectedTextArea = this.expectLocated(
      this.accounting.registerTestId(TEXT_AREA_TEST_IDS[textAreaMeaning]),
    );

    await expectedTextArea.toBeInViewport();
    await expectedTextArea.toBeDisabled();
  },
);

Then(
  "I expect to see the {string} button in the loading state",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await expect(
      this.locate(
        this.accounting.registerTestId(BUTTON_TEST_IDS[buttonMeaning]),
      ).locator("svg"),
    ).toBeInViewport();
  },
);

When(
  "I type some text to all items inputs",
  async function (this: ComplexWorld) {
    const allItemsInputs = await this.locate(LIST_ITEM_INPUT).all();
    let count = 0;

    for (const itemInput of allItemsInputs) {
      count++;
      await itemInput.fill(
        `${count} ${getStringUpToLimit(EDIT_LIST_INPUT_LIMIT - count.toString().length - 1)}`,
      );
    }
  },
);

Then("I expect all items inputs disabled", async function (this: ComplexWorld) {
  const allItemsInputs = await this.locate(LIST_ITEM_INPUT).all();

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
    this.numbers[requestMeaning] = 0;

    this.page.on("request", (data) => {
      const { address, method } = ADDRESSES_MEANINGS[requestMeaning];
      const url = data.url();
      const requestMethod = data.method();

      const urlPath = url.replace(/^https?:\/\/[^\/]+/, "");

      let isMatch = false;

      if (address.includes("*")) {
        const patternBase = address.replace(/\*/g, "[^/]+");
        const pattern = patternBase.endsWith("/")
          ? patternBase.slice(0, -1)
          : patternBase;
        const regex = new RegExp(pattern.replace(/\//g, "\\/"));
        isMatch = regex.test(urlPath);
      } else {
        isMatch =
          urlPath.endsWith(address) ||
          urlPath.endsWith(address.replaceAll("/", ""));
      }

      if (isMatch && requestMethod === method) {
        if (this.numbers[requestMeaning]) {
          this.numbers[requestMeaning]++;
        } else {
          this.numbers[requestMeaning] = 1;
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
    expect(this.numbers[requestMeaning]).toBe(
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

When("I wait for the list to create", async function (this: ComplexWorld) {
  await this.page.waitForURL(`**${SOME_LIST}`);
});

Then(
  "I expect to see the {string} input with the text I provided",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    const expectedText = this.data[inputMeaning] || "";
    await this.expectLocated(INPUT_TEST_IDS[inputMeaning]).toHaveValue(
      expectedText,
    );
  },
);

Then(
  "I expect to see the {string} text area with the text I provided",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    const expectedText = this.data[textAreaMeaning] || "";
    await this.expectLocated(TEXT_AREA_TEST_IDS[textAreaMeaning]).toHaveValue(
      expectedText,
    );
  },
);

When("I refresh the page", async function (this: ComplexWorld) {
  await this.page.reload();
});

When("I wait for the page to load", async function (this: ComplexWorld) {
  await this.page.waitForLoadState("networkidle");
});

Then(
  "I expect to see the {string} item input disabled",
  async function (this: ComplexWorld, itemInputMeaning: ItemInputMeaning) {
    const listItemInput = this.locateByFullId(
      ITEM_INPUT_TEST_IDS[itemInputMeaning],
    );
    await registerItem.call(this, listItemInput);

    await expect(listItemInput).toBeInViewport();
    await expect(listItemInput).toBeDisabled();
  },
);

Then(
  "I expect to see the {string} item input enabled",
  async function (this: ComplexWorld, itemInputMeaning: ItemInputMeaning) {
    const listItemInput = this.locateByFullId(
      ITEM_INPUT_TEST_IDS[itemInputMeaning],
    );
    await registerItem.call(this, listItemInput);

    await expect(listItemInput).toBeInViewport();
    await expect(listItemInput).toBeEnabled();
  },
);
