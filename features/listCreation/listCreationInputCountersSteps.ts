import { Then } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import { COUNTER_TEST_IDS, type CounterMeaning } from "./testIds.ts";

Then(
  "I expect to see the {string} counter",
  async function (this: ComplexWorld, counterMeaning: CounterMeaning) {
    await this.expectLocated(COUNTER_TEST_IDS[counterMeaning]).toBeInViewport();
  },
);
