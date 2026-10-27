// Ported from features/user_isolation/user_isolation_steps.clj
// — complete.
import { And, Then, When, is, type TestData } from "../../support/world.ts";
import { NAME } from "../../../src-ts/domain/svernik.ts";
import { request } from "../../support/http.ts";
import { listsRoute, listRoute } from "../../utilities/routes.ts";
import { attemptToHandleEssenceReturnStatusAndErrors } from "../../utilities/requestEssence.ts";
import {
  requestItemExploration,
  requestItemHead,
  requestItemUpdate,
  requestItemsHead,
} from "../../utilities/requestItem.ts";
import {
  requestListBasedDataListUpdate,
  requestListDeletion,
  requestListExploration,
} from "../../utilities/requestList.ts";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

// attempt-to-handle-essence-return-status-and-errors merged over the
// threading data (donor (merge data ...)).
const mergeAttempt = async (
  data: TestData,
  response: Promise<import("../../support/http.ts").ApiResponse>,
): Promise<TestData> => {
  const { status, failedActionsAttempt } = await attemptToHandleEssenceReturnStatusAndErrors(
    await response,
  );
  return { ...data, status, failedActionsAttempt };
};

When("I send HEAD /lists with a valid token", async (data: TestData): Promise<TestData> => {
  const response = await request("HEAD", listsRoute(), { token: sessionTokenOf(data) });
  return { ...data, response, headContentLength: response.headers.get("content-length") };
});

Then("my lists do not include other users' lists", (data: TestData): TestData => {
  const userId = (data.auth as { userId?: string }).userId;
  const exploredLists = (data.exploredLists ?? []) as { userId?: string }[];
  is(
    exploredLists.every((someList) => someList.userId === userId),
    `Expected every explored list to belong to the user ${JSON.stringify(userId)}.`,
  );
  return data;
});

Then("GET and HEAD Content-Length headers match", (data: TestData): TestData => {
  is(
    data.contentLength === data.headContentLength,
    `Expected the GET and HEAD Content-Length headers to match, got ${JSON.stringify(data.contentLength)} vs ${JSON.stringify(data.headContentLength)}.`,
  );
  return data;
});

And("I remember this list as {string}", (data: TestData, listName: string): TestData => ({
  ...data,
  [listName]: data.preparedList,
}));

When("I ask for the {string} list", async (data: TestData, listName: string): Promise<TestData> =>
  mergeAttempt(
    data,
    requestListExploration(
      sessionTokenOf(data),
      ((data[listName] as Record<string, unknown>).id) as string,
    ),
  ),
);

When("I ask for the {string} list via HEAD", async (data: TestData, listName: string): Promise<TestData> => {
  const response = await request("HEAD", listRoute(((data[listName] as Record<string, unknown>).id) as string), {
    token: sessionTokenOf(data),
  });
  return { ...data, status: response.status };
});

When("I try to update the {string} list", async (data: TestData, listName: string): Promise<TestData> =>
  mergeAttempt(
    data,
    requestListBasedDataListUpdate(
      sessionTokenOf(data),
      ((data[listName] as Record<string, unknown>).id) as string,
      { [NAME]: "Attempted update" },
    ),
  ),
);

When("I try to delete the {string} list", async (data: TestData, listName: string): Promise<TestData> =>
  mergeAttempt(
    data,
    requestListDeletion(
      sessionTokenOf(data),
      ((data[listName] as Record<string, unknown>).id) as string,
      null,
    ),
  ),
);

And("I remember the first item of this list as {string}", (data: TestData, itemName: string): TestData => {
  const firstItem = ((data.preparedList as Record<string, unknown>).items as Record<
    string,
    unknown
  >[])[0]!;
  return { ...data, [itemName]: { id: firstItem.id } };
});

When("I send HEAD /items with a valid token", async (data: TestData): Promise<TestData> => {
  const response = await requestItemsHead(sessionTokenOf(data));
  return { ...data, status: response.status };
});

When("I attempt to ask for the {string} item", async (data: TestData, itemName: string): Promise<TestData> =>
  mergeAttempt(
    data,
    requestItemExploration(
      sessionTokenOf(data),
      ((data[itemName] as Record<string, unknown>).id) as string,
    ),
  ),
);

When("I ask for the {string} item via HEAD", async (data: TestData, itemName: string): Promise<TestData> => {
  const response = await requestItemHead(
    sessionTokenOf(data),
    ((data[itemName] as Record<string, unknown>).id) as string,
  );
  return { ...data, status: response.status };
});

When("I attempt to update the {string} item", async (data: TestData, itemName: string): Promise<TestData> =>
  mergeAttempt(
    data,
    requestItemUpdate(
      sessionTokenOf(data),
      ((data[itemName] as Record<string, unknown>).id) as string,
      { [NAME]: "Attempted update" },
    ),
  ),
);
