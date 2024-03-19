import { Then } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import { COUNTER_TEST_IDS, type CounterMeaning } from "./testIds.ts";
import {
  EDIT_LIST_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
} from "../../configuration.ts";

Then(
  "I expect to see the {string} counter",
  async function (this: ComplexWorld, counterMeaning: CounterMeaning) {
    await this.expectLocated(COUNTER_TEST_IDS[counterMeaning]).toBeInViewport();
  },
);

const COUNTER_LIMITS = {
  "list title input": LIST_TITLE_INPUT_LIMIT,
  "first item input": EDIT_LIST_INPUT_LIMIT,
};

Then(
  "I expect {string} counter to show the correct limit",
  async function (this: ComplexWorld, counterMeaning: CounterMeaning) {
    await this.expectLocated(COUNTER_TEST_IDS[counterMeaning]).toHaveText(
      COUNTER_LIMITS[counterMeaning].toString(),
    );
  },
);
