import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import {
  COUNTER_DISPLAY_LIMIT,
  EDIT_LIST_INPUT_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
} from "../../configuration.ts";
import type { ComplexWorld } from "../context/hooks";
import { INPUT_TEST_IDS, type InputMeaning } from "../list/listCreation/testIds.ts";
import {
  getStringCloseToLimit,
  getStringLongerThanLowerLimit,
  getStringUpToLimit,
} from "../utilities/getStringOfLength.ts";

When(
  "I type the following text into the {string} input: {string}",
  async function (this: ComplexWorld, inputName: InputMeaning, text: string) {
    await locateInput(this, inputName).fill(text);
  },
);

When(
  "I add the following text into the {string} input: {string}",
  async function (this: ComplexWorld, inputName: InputMeaning, text: string) {
    const input = locateInput(this, inputName);

    input.press("End");

    for (const char of text) {
      await input.press(char);
    }
  },
);

Then("I expect to see the {string} input empty", async function (this: ComplexWorld, inputName: InputMeaning) {
  const input = locateInput(this, inputName);

  await expect(input).toHaveValue("");
});

Then(
  "I expect to see the {string} input to have the following text: {string}",
  async function (this: ComplexWorld, inputName: InputMeaning, text: string) {
    await expect(locateInput(this, inputName)).toHaveValue(text);
  },
);

const INPUT_LIMIT_RELATION = {
  "list title": LIST_TITLE_INPUT_LIMIT,
  "list purpose": LIST_PURPOSE_INPUT_LIMIT,
  "first item": EDIT_LIST_INPUT_LIMIT,
  "second item": EDIT_LIST_INPUT_LIMIT,
  "third item": EDIT_LIST_INPUT_LIMIT,
  "forth item": EDIT_LIST_INPUT_LIMIT,
  "automatic item": EDIT_LIST_INPUT_LIMIT,
  "last item": EDIT_LIST_INPUT_LIMIT,
  "some item": EDIT_LIST_INPUT_LIMIT,
  "search bar": LIST_TITLE_INPUT_LIMIT,
};

When(
  "I type some text with length less or equal to the one of {string} input limit",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    const text = getStringUpToLimit(INPUT_LIMIT_RELATION[inputMeaning]);

    this.oldData[inputMeaning] = this.data[inputMeaning] || "";
    this.data[inputMeaning] = text;

    await locateInput(this, inputMeaning).fill(text);
  },
);

When(
  "I type some text with length more than of {string} input limit",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    await locateInput(this, inputMeaning).fill(getStringLongerThanLowerLimit(INPUT_LIMIT_RELATION[inputMeaning]));
  },
);

When(
  "I type some text with length close to the one of {string} input limit",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    await locateInput(this, inputMeaning).fill(
      getStringCloseToLimit(INPUT_LIMIT_RELATION[inputMeaning], COUNTER_DISPLAY_LIMIT),
    );
  },
);

Then(
  "I expect {string} input content length to be equal to its limit",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    const inputValueLength = (await locateInput(this, inputMeaning).inputValue()).length;

    expect(inputValueLength).toBe(INPUT_LIMIT_RELATION[inputMeaning]);
  },
);

function locateInput(complexWorld: ComplexWorld, inputMeaning: InputMeaning) {
  let input = complexWorld.locateByFullId(INPUT_TEST_IDS[inputMeaning]);

  if (inputMeaning === "last item") {
    input = complexWorld.locateByIdParts(INPUT_TEST_IDS[inputMeaning]).last();
  }

  return input;
}
