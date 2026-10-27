// Ported from features/request_handling/request_clear_database_steps.clj.
import { Then, When, is, type TestData } from "../../support/world.ts";
import { request, type ApiResponse } from "../../support/http.ts";
import { OK } from "../../utilities/httpStatuses.ts";
import { clearListsAndItemsRoute, clearUsersRoute } from "../../utilities/routes.ts";

type ResponseData = TestData & Partial<ApiResponse>;

When(
  "I make a request to clear {string} using GET HTTP method",
  async (_data: TestData, entities: string): Promise<TestData> => {
    const route =
      entities === "lists and items"
        ? clearListsAndItemsRoute()
        : entities === "users"
          ? clearUsersRoute()
          : (() => {
              throw new Error(`Unknown clear target: ${entities}`);
            })();
    return (await request("GET", route)) as never;
  },
);

Then(
  "I expect successful response with body: {string}",
  (response: ResponseData, expectedBody: string): TestData => {
    is(response.status === OK);
    is(response.text === expectedBody);
    return response as TestData;
  },
);
