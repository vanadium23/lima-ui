// The lambdaisland.cucumber DSL facade, ported: every step receives the
// previous step's return value as `data` and its own return value (when
// defined) becomes the next step's `data`. Undefined returns keep the
// previous state (the donor steps always return `data` explicitly, so
// this only guards against porting slips).
//
// Step keywords do not constrain matching in cucumber-js (Given/When/
// Then share one registry), which is at least as lenient as the donor
// harness — patterns must stay globally unique, the inventory tool
// checks that.
import {
  AfterAll as rawAfterAll,
  BeforeAll as rawBeforeAll,
  Given as rawGiven,
  Then as rawThen,
  When as rawWhen,
  setDefaultTimeout,
  setWorldConstructor,
} from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { isDeepStrictEqual } from "node:util";

export type TestData = Record<string, unknown> & { [key: string]: any };
// `any` captures: donor step bodies type their captures per-pattern.
export type StepBody = (data: TestData, ...args: any[]) => unknown;

export class LimaWorld {
  data: TestData = {};
}

setWorldConstructor(LimaWorld);
// Creating 25+ lists over HTTP inside one step comfortably exceeds the
// cucumber-js 5s default; the heaviest read (GET /lists with hundreds
// of accumulated lists on the Clojure backend near the end of a full
// suite run) takes minutes — the donor kaocha harness has no per-step
// timeout at all, so the budget here only bounds runaway hangs.
setDefaultTimeout(300_000);

type Registration = (pattern: string, fn: (...args: never[]) => unknown) => void;

// cucumber-js validates fn.length === capture count (or +1 for the
// legacy callback style), and user_code_runner treats fn.length ===
// captures+1 as callback style — so the wrapper's declared arity must
// exactly match the number of placeholders in the pattern.
const captureCount = (pattern: string): number =>
  (pattern.match(/\{[^}]*\}/g) ?? []).length;

// cucumber-expressions treats a bare "/" as alternation, but the
// lambdaisland patterns are plain literals ("... update /lists") — the
// facade escapes unescaped slashes so donor patterns port verbatim.
const escapePattern = (pattern: string): string =>
  pattern.replace(/(?<!\\)\//g, "\\/");

const bind =
  (register: Registration) =>
  (pattern: string, body: StepBody): void => {
    const escaped = escapePattern(pattern);
    const run = async (world: LimaWorld, captures: unknown[]): Promise<void> => {
      const result = await body.call(world, world.data, ...captures);
      if (result !== undefined) {
        world.data = result as TestData;
      }
    };
    switch (captureCount(pattern)) {
      case 0:
        register(
          escaped,
          async function (this: LimaWorld) {
            await run(this, []);
          } as never,
        );
        break;
      case 1:
        register(
          escaped,
          async function (this: LimaWorld, first: unknown) {
            await run(this, [first]);
          } as never,
        );
        break;
      case 2:
        register(
          escaped,
          async function (this: LimaWorld, first: unknown, second: unknown) {
            await run(this, [first, second]);
          } as never,
        );
        break;
      default:
        throw new Error(
          `Step pattern with ${captureCount(pattern)} captures is not supported by the facade: ${pattern}`,
        );
    }
  };

export const Given = bind(rawGiven as unknown as Registration);
export const When = bind(rawWhen as unknown as Registration);
export const Then = bind(rawThen as unknown as Registration);
// And/But are not separate registrations in cucumber-js (one shared
// registry); the donor facade's And/But map onto the same binding.
export const And = Given;
export const But = Then;

// clojure.test `is`: any failing assertion throws and fails the step.
export const equalsValue = (actual: unknown, expected: unknown): boolean =>
  isDeepStrictEqual(actual, expected);
export const is = (condition: boolean, message?: string): void => {
  assert.ok(condition, message);
};
export const isEqual = (
  actual: unknown,
  expected: unknown,
  message?: string,
): void => {
  is(
    equalsValue(actual, expected),
    message ?? `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`,
  );
};

export const BeforeAll = rawBeforeAll;
export const AfterAll = rawAfterAll;
