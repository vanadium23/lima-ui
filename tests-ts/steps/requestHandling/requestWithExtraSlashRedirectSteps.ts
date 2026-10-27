// Ported from features/request_handling/request_with_extra_slash_redirect_steps.clj.
import { Then, When, is, type TestData } from "../../support/world.ts";
import {
  mapRequestApplicationRoutes,
} from "../../utilities/applicationRoutes.ts";
import { request, type ApiResponse } from "../../support/http.ts";
import { MOVED_PERMANENTLY, PERMANENT_REDIRECT } from "../../utilities/httpStatuses.ts";

const SLASH = "/";

interface RedirectResult {
  status: number;
  location: string | null;
}

const extractLocationHeader = (response: ApiResponse): string | null =>
  response.headers.get("location");

When(
  "I make request using any route with excessive slash",
  async (): Promise<TestData> => ({
    redirects: (await mapRequestApplicationRoutes({
      filterRoutes: (routes) => {
        const { ["/"]: _home, ...rest } = routes;
        return rest;
      },
      modifyUrl: (url) => url + SLASH,
      handleResults: (results) =>
        results.map((response) => ({
          status: response.status,
          location: extractLocationHeader(response),
        })),
    })) as RedirectResult[],
  }) as never,
);

Then(
  "I see the redirect to slashless URL",
  (data: TestData): TestData => {
    for (const { status, location } of (data as { redirects: RedirectResult[] }).redirects) {
      is(
        status === MOVED_PERMANENTLY || status === PERMANENT_REDIRECT,
        `Expected a redirect status, got ${status}.`,
      );
      is(
        location !== null && !location.endsWith(SLASH),
        `Expected a slashless Location, got ${String(location)}.`,
      );
    }
    return data;
  },
);
