// Ported from features/request_handling/request_using_head_HTTP_method_steps.clj.
import { Then, When, is, type TestData } from "../../support/world.ts";
import {
  allRoutesAsMap,
  mapRequestApplicationRoutes,
} from "../../utilities/applicationRoutes.ts";
import { doseqAreStatusesAsExpectedReturnBodies } from "../../utilities/iterate.ts";
import { METHOD_NOT_ALLOWED } from "../../utilities/httpStatuses.ts";

When(
  "I plan to make a request using HEAD HTTP method",
  (): TestData => allRoutesAsMap as never,
);

Then(
  "I expect every Svernik route to support HEAD HTTP method",
  (allRoutes: TestData): TestData => {
    for (const methods of Object.values(allRoutes as Record<string, string[]>)) {
      is(methods.includes("HEAD"));
    }
    return allRoutes;
  },
);

When(
  "I make request using any route with HEAD method",
  async (): Promise<TestData> =>
    ({
      statusesAndBodies: await mapRequestApplicationRoutes({
        modifyMethods: (methods) => methods.filter((method) => method === "HEAD"),
      }),
    }) as never,
);

Then(
  "I expect not to receive the 405, METHOD NOT ALLOWED, HTTP response status",
  (statusesAndBodies: TestData): TestData => {
    // The donor threads the doseq result ({bodies}) into the next step.
    return doseqAreStatusesAsExpectedReturnBodies(
      statusesAndBodies as never,
      METHOD_NOT_ALLOWED,
      (expected, actual) => expected !== actual,
    ) as never;
  },
);

Then(
  "I expect to receive the empty response body",
  (bodies: TestData): TestData => {
    for (const body of (bodies as { bodies: unknown[] }).bodies) {
      is(body === null || body === undefined);
    }
    return bodies;
  },
);
