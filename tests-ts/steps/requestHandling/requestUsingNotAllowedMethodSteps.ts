// Ported from features/request_handling/request_using_not_allowed_method_steps.clj.
import { ERRORS } from "../../../src-ts/domain/constants.ts";
import { Then, When, type TestData } from "../../support/world.ts";
import { mapRequestApplicationRoutes } from "../../utilities/applicationRoutes.ts";
import { doseqAreStatusesAsExpectedReturnBodies, doseqIsFailedActionsAttempt } from "../../utilities/iterate.ts";
import { METHOD_NOT_ALLOWED } from "../../utilities/httpStatuses.ts";

const POPULAR_HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

When(
  "I make request using any route but with this route's unsupported methods",
  async (): Promise<TestData> =>
    ({
      statusesAndBodies: await mapRequestApplicationRoutes({
        modifyMethods: (methods) =>
          POPULAR_HTTP_METHODS.filter((method) => !methods.includes(method)),
      }),
    }) as never,
);

Then(
  "I expect to receive the 405, METHOD NOT ALLOWED, HTTP response status",
  (statusesAndBodies: TestData): TestData => {
    // The donor threads the doseq result ({bodies}) into the next step.
    return doseqAreStatusesAsExpectedReturnBodies(
      statusesAndBodies as never,
      METHOD_NOT_ALLOWED,
    ) as never;
  },
);

Then(
  "I see the HTTP-method-not-allowed error as the response data",
  (data: TestData): TestData => {
    doseqIsFailedActionsAttempt(
      { failedActionsAttempt: (data as { bodies: unknown[] }).bodies },
      [ERRORS.methodNotAllowed.id],
    );
    return data;
  },
);
