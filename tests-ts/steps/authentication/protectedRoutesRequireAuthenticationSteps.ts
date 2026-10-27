// Ported from features/authentication/protected_routes_require_authentication_steps.clj.
import { Then, When, type TestData } from "../../support/world.ts";
import {
  mapRequestApplicationRoutes,
  isProtectedRoute,
} from "../../utilities/applicationRoutes.ts";
import { doseqAreStatusesAsExpectedReturnBodies } from "../../utilities/iterate.ts";
import { UNAUTHORIZED } from "../../utilities/httpStatuses.ts";

When(
  "I make requests to all protected routes without Authorization header",
  async (): Promise<TestData> =>
    ({
      statusesAndBodies: await mapRequestApplicationRoutes({
        filterRoutes: (routes) =>
          Object.fromEntries(
            Object.entries(routes).filter(([url]) => isProtectedRoute(url)),
          ),
        requestOptions: { headers: {} },
        modifyMethods: (methods) => methods.filter((method) => method !== "OPTIONS"),
      }),
    }) as never,
);

Then(
  "I expect every protected route to return 401 Unauthorized",
  (statusesAndBodies: TestData): TestData => {
    doseqAreStatusesAsExpectedReturnBodies(statusesAndBodies as never, UNAUTHORIZED);
    return statusesAndBodies;
  },
);
