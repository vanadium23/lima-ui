import { Then, When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { PAGE_NOT_FOUND } from "../testIds.ts";
import { getTimeoutOrCancelItIfDebugging } from "../utilities/getTimeoutOrCancelItIfDebugging.ts";

const SEGMENT_COUNT_MIN = 1;
const SEGMENT_COUNT_MAX = 4;

When(
  "I navigate to a random non-existent page",
  { timeout: getTimeoutOrCancelItIfDebugging(10000) },
  async function (this: ComplexWorld) {
    const randomPath = generateRandomPath();

    await this.navigate(randomPath);
  },
);

Then("I expect to see the 404 error message", async function (this: ComplexWorld) {
  await this.expectLocated(PAGE_NOT_FOUND).toBeInViewport();
});

function generateRandomSegment(baseSeed: number): string {
  const randomValue = Math.abs(Math.sin(baseSeed * 9999) * 10000000);

  return Math.floor(randomValue).toString(36);
}

function generateRandomPath(): string {
  const baseSeed = Date.now();
  const segmentCount =
    (Math.floor(Math.abs(Math.sin(baseSeed * 8888) * 1000)) % (SEGMENT_COUNT_MAX - SEGMENT_COUNT_MIN + 1)) +
    SEGMENT_COUNT_MIN;
  const segments: string[] = [];

  for (let i = 0; i < segmentCount; i++) {
    segments.push(generateRandomSegment(baseSeed + i * 1111));
  }

  return `/${segments.join("/")}`;
}
