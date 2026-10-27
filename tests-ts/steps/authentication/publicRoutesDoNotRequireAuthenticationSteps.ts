// Ported from features/authentication/public_routes_do_not_require_authentication_steps.clj.
import { Then, When, type TestData } from "../../support/world.ts";
import {
  mapRequestApplicationRoutes,
  PUBLIC_ROUTES,
} from "../../utilities/applicationRoutes.ts";
import { doseqAreStatusesAsExpectedReturnBodies } from "../../utilities/iterate.ts";
import { UNAUTHORIZED } from "../../utilities/httpStatuses.ts";

When(
  "I make requests to all public routes without Authorization header",
  async (): Promise<TestData> =>
    ({
      statusesAndBodies: await mapRequestApplicationRoutes({
        filterRoutes: (routes) =>
          Object.fromEntries(
            Object.entries(routes).filter(([url]) => PUBLIC_ROUTES.has(url)),
          ),
        requestOptions: { headers: {} },
        modifyMethods: (methods) => methods.filter((method) => method !== "OPTIONS"),
      }),
    }) as never,
);

Then(
  "I expect no public route to return 401 Unauthorized",
  (statusesAndBodies: TestData): TestData => {
    doseqAreStatusesAsExpectedReturnBodies(
      statusesAndBodies as never,
      UNAUTHORIZED,
      (expected, actual) => expected !== actual,
    );
    return statusesAndBodies;
  },
);
