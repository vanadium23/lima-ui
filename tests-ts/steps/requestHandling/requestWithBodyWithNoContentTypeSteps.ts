// Ported from features/request_handling/request_with_body_with_no_content_type_steps.clj.
import { Then, When, is, type TestData } from "../../support/world.ts";
import { mapRequestBodyExpectedRoutes } from "../../utilities/applicationRoutes.ts";
import { INTERNAL_SERVER_ERROR } from "../../utilities/httpStatuses.ts";

When(
  "I make request using any route with body but without Content-Type",
  async (): Promise<TestData> =>
    ({
      statuses: (
        (await mapRequestBodyExpectedRoutes({
          rawBody: "{}",
          noContentType: true,
        })) as { status: number }[]
      ).map((entry) => entry.status),
    }) as never,
);

Then(
  "I expect not to receive the 500, INTERNAL SERVER ERROR, HTTP response status",
  (statuses: TestData): TestData => {
    for (const status of (statuses as { statuses: number[] }).statuses) {
      is(status !== INTERNAL_SERVER_ERROR, `Got an unexpected 500 (status ${status}).`);
    }
    return statuses;
  },
);
