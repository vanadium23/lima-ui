import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import {
  EDIT_LIST_INPUT_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
  NOTE_TEXT_AREA_LIMIT,
} from "../../../configuration.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import { extractInputTestIdFromItsCounterTestId } from "../../testIds.ts";
import {
  getStringLongerThanLowerLimit,
  getStringUpToLimit,
} from "../../utilities/getStringOfLength.ts";

import {
  COUNTER_TEST_IDS,
  type CounterMeaning,
  INPUT_TEST_IDS,
  type InputMeaning,
} from "./testIds.ts";

Then(
  "I expect to see the {string} counter",
  async function (this: ComplexWorld, counterMeaning: CounterMeaning) {
    await this.expectLocated(COUNTER_TEST_IDS[counterMeaning]).toBeInViewport();
  },
);

const COUNTER_LIMITS = {
  "list title input": LIST_TITLE_INPUT_LIMIT,
  "list purpose input": LIST_PURPOSE_INPUT_LIMIT,
  "first item input": EDIT_LIST_INPUT_LIMIT,
  "list note text area": NOTE_TEXT_AREA_LIMIT,
};

Then(
  "I expect {string} counter to show the correct limit",
  async function (this: ComplexWorld, counterMeaning: CounterMeaning) {
    await this.expectLocated(COUNTER_TEST_IDS[counterMeaning]).toHaveText(
      COUNTER_LIMITS[counterMeaning].toString(),
    );
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
};

When(
  "I type some text with length less or equal to the one of {string} input limit",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    const inputLimit = INPUT_LIMIT_RELATION[inputMeaning];

    const text = getStringUpToLimit(inputLimit);

    this.oldData[inputMeaning] = this.data[inputMeaning] || "";
    this.data[inputMeaning] = text;

    let input = this.locateByFullId(INPUT_TEST_IDS[inputMeaning]);

    if (inputMeaning === "last item") {
      input = this.locateByIdParts(INPUT_TEST_IDS[inputMeaning]).last();
    }

    await input.fill(text);
  },
);

Then(
  "I expect {string} counter to show the correct remaining value",
  async function (this: ComplexWorld, counterMeaning: CounterMeaning) {
    const inputTestId = extractInputTestIdFromItsCounterTestId(
      COUNTER_TEST_IDS[counterMeaning],
    );
    const inputValue = await this.locateByFullId(inputTestId).inputValue();

    const counterRemainder = COUNTER_LIMITS[counterMeaning] - inputValue.length;
    await this.expectLocated(COUNTER_TEST_IDS[counterMeaning]).toHaveText(
      counterRemainder.toString(),
    );
  },
);

When(
  "I type some text with length more than of {string} input limit",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    const inputLimit = INPUT_LIMIT_RELATION[inputMeaning];

    await this.locateByFullId(INPUT_TEST_IDS[inputMeaning]).fill(
      getStringLongerThanLowerLimit(inputLimit),
    );
  },
);

Then(
  "I expect {string} counter to show {int}",
  async function (
    this: ComplexWorld,
    counterMeaning: CounterMeaning,
    remainder: 0,
  ) {
    await this.expectLocated(COUNTER_TEST_IDS[counterMeaning]).toHaveText(
      remainder.toString(),
    );
  },
);

Then(
  "I expect {string} input content length to be equal to its limit",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    const inputValueLength = (
      await this.locateByFullId(INPUT_TEST_IDS[inputMeaning]).inputValue()
    ).length;

    const inputLimit = INPUT_LIMIT_RELATION[inputMeaning];

    expect(inputValueLength).toBe(inputLimit);
  },
);
