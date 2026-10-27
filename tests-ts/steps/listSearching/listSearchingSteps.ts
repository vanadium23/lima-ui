// Ported from features/list_searching/list_searching_steps.clj — complete.
import {
  And,
  Then,
  When,
  is,
  equalsValue,
  type TestData,
} from "../../support/world.ts";
import { ID, NAME, QUERY } from "../../../src-ts/domain/svernik.ts";
import { createRandomString } from "../../utilities/buildRandom.ts";
import { assocInParsedFromJsonIfNotAbsent } from "../../utilities/handleRawData.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import { isThatAllFieldsInEssenceOverviewed } from "../../utilities/isThatAllFieldsInEssenceOverviewed.ts";
import {
  getPayloadAccounted,
  type PayloadAccounted,
} from "../../utilities/payloadAccounted.ts";
import {
  attemptToHandleEssenceReturnStatusAndErrors,
} from "../../utilities/requestEssence.ts";
import {
  requestSearchLists,
  requestSearchListsParsed,
} from "../../utilities/requestSearch.ts";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

// (select-keys data [:query]): {} when the query is absent, otherwise
// the single-key map (a null query is kept).
const searchDataOf = (data: TestData): Record<string, unknown> =>
  data[QUERY] === undefined ? {} : { [QUERY]: data[QUERY] };

When("I want to search lists", (data: TestData): TestData => data);

And("I provide a query: {}", (data: TestData, query: string): TestData =>
  assocInParsedFromJsonIfNotAbsent(data, [QUERY], query));

And("I provide a query with length: {int}", (data: TestData, queryLength: number): TestData => ({
  ...data,
  [QUERY]: createRandomString(queryLength),
}));

Then("my attempt to search lists fails", async (data: TestData): Promise<TestData> => {
  const response = await requestSearchLists(sessionTokenOf(data), searchDataOf(data));
  const { status, failedActionsAttempt } =
    await attemptToHandleEssenceReturnStatusAndErrors(response);
  return { ...data, status, failedActionsAttempt };
});

Then("I successfully search lists", async (data: TestData): Promise<TestData> => {
  const result = await requestSearchListsParsed(sessionTokenOf(data), searchDataOf(data));
  is(
    equalsValue(result.status, 200),
    "Status code should be 200",
  );
  return { ...data, ...result };
});

And("I see the following total number of search results: {int}", (data: TestData, total: number): TestData => {
  const searchResult = data.searchResultParsed;
  is(
    equalsValue(Array.isArray(searchResult) ? searchResult.length : 0, total),
    `Total number of results should be ${total}`,
  );
  return data;
});

Then("I want to inspect first list", (data: TestData): PayloadAccounted =>
  getPayloadAccounted(
    (data.searchResultParsed as Record<string, unknown>[])[0] as Record<string, unknown>,
  ));

Then("I see the following list name: {}", (data: TestData, listName: string): PayloadAccounted => {
  const foundListAccounted = data as unknown as PayloadAccounted;
  isEssenceAccountedFieldValid(foundListAccounted, [NAME], "svernik.domain.svernik/name");
  is(
    equalsValue(foundListAccounted.getField([NAME]), listName),
    `List name should be ${listName}`,
  );
  return foundListAccounted;
});

Then("I see the following list id: {}", (data: TestData, listId: string): PayloadAccounted => {
  const foundListAccounted = data as unknown as PayloadAccounted;
  isEssenceAccountedFieldValid(foundListAccounted, [ID], "svernik.domain.svernik/id");
  is(
    equalsValue(foundListAccounted.getField([ID]), listId),
    `List id should be ${listId}`,
  );
  return foundListAccounted;
});

Then("I overviewed all fields in found list", (data: TestData): PayloadAccounted => {
  const foundListAccounted = data as unknown as PayloadAccounted;
  isThatAllFieldsInEssenceOverviewed(
    foundListAccounted,
    "svernik.domain.link-to-list/link-to-list-keys",
  );
  return foundListAccounted;
});
