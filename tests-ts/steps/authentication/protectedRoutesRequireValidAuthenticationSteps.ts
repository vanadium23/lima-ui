// Ported from features/authentication/protected_routes_require_valid_authentication_steps.clj.
import { When, type TestData } from "../../support/world.ts";
import {
  mapRequestApplicationRoutes,
  isProtectedRoute,
} from "../../utilities/applicationRoutes.ts";

When(
  "I make requests to all protected routes with Authorization header {string}",
  async (_data: TestData, authorizationHeader: string): Promise<TestData> =>
    ({
      statusesAndBodies: await mapRequestApplicationRoutes({
        filterRoutes: (routes) =>
          Object.fromEntries(
            Object.entries(routes).filter(([url]) => isProtectedRoute(url)),
          ),
        requestOptions: { headers: { Authorization: authorizationHeader } },
        modifyMethods: (methods) => methods.filter((method) => method !== "OPTIONS"),
      }),
    }) as never,
);
