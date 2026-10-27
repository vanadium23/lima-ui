// Ported from features/request_handling/request_with_invalid_JSON_body_steps.clj
// (donor uses the raw lambdaisland DSL, no facade underscore).
import { ERRORS } from "../../../src-ts/domain/constants.ts";
import { Then, When, type TestData } from "../../support/world.ts";
import { mapRequestBodyExpectedRoutes } from "../../utilities/applicationRoutes.ts";
import { doseqAreStatusesAsExpectedReturnBodies, doseqIsFailedActionsAttempt } from "../../utilities/iterate.ts";
import { BAD_REQUEST } from "../../utilities/httpStatuses.ts";

When(
  "I make request using any route with invalid JSON body",
  async (): Promise<TestData> =>
    ({
      statusesAndBodies: await mapRequestBodyExpectedRoutes({
        rawBody: "}{",
      }),
    }) as never,
);

Then(
  "I expect to receive the 400, BAD REQUEST, HTTP response status",
  (statusesAndBodies: TestData): TestData => {
    // The donor threads the doseq result ({bodies}) into the next step.
    return doseqAreStatusesAsExpectedReturnBodies(
      statusesAndBodies as never,
      BAD_REQUEST,
    ) as never;
  },
);

Then(
  "I see the invalid-JSON error as the response data",
  (data: TestData): TestData => {
    doseqIsFailedActionsAttempt(
      { failedActionsAttempt: (data as { bodies: unknown[] }).bodies },
      [ERRORS.invalidJSON.id],
    );
    return data;
  },
);
