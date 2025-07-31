import { Then } from "@cucumber/cucumber";

import {
  EDIT_LIST_INPUT_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
  NOTE_TEXT_AREA_LIMIT,
} from "../../../configuration.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import { extractInputTestIdFromItsCounterTestId } from "../../testIds.ts";

import { COUNTER_TEST_IDS, type CounterMeaning } from "./testIds.ts";

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
