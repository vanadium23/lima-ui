// Ported from features/user_isolation/
// user_isolation_search_count_steps.clj — complete.
import { And, Then, When, is, type TestData } from "../../support/world.ts";
import { request } from "../../support/http.ts";
import { countListsRoute } from "../../utilities/routes.ts";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

And("search results do not include other users' lists", (data: TestData): TestData => {
  const otherListId = (data["other's"] as Record<string, unknown>).id;
  const searchResult = (data.searchResultParsed ?? []) as { id?: unknown }[];
  is(
    !searchResult.some((someList) => someList.id === otherListId),
    "Search results should not contain other user's list",
  );
  return data;
});

When("I send HEAD to count lists with a valid token", async (data: TestData): Promise<TestData> => {
  const response = await request("HEAD", countListsRoute(), { token: sessionTokenOf(data) });
  return { ...data, countHeadContentLength: response.headers.get("content-length") };
});

Then("GET and HEAD Content-Length headers match for count", (data: TestData): TestData => {
  const getContentLength = (
    data.countResponse as { headers?: { get?: (name: string) => string | null } }
  ).headers?.get?.("content-length");
  is(
    getContentLength === data.countHeadContentLength,
    `Expected the GET and HEAD Content-Length headers to match for count, got ${JSON.stringify(getContentLength)} vs ${JSON.stringify(data.countHeadContentLength)}.`,
  );
  return data;
});
