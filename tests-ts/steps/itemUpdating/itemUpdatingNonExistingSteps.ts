// Ported from
// features/item_updating/item_updating_non_existing_steps.clj — complete.
import { Then, When, is, equalsValue, type TestData } from "../../support/world.ts";
import { CONTENT, REASON_FOR_LATEST_UPDATE } from "../../../src-ts/domain/svernik.ts";
import { ROUTES } from "../../../src-ts/domain/constants.ts";
import { request, type ApiResponse } from "../../support/http.ts";
import { serverUrl } from "../../support/config.ts";
import { PERMANENT_REDIRECT } from "../../utilities/httpStatuses.ts";
import { extractLocationHeader } from "../../utilities/extractLocationHeader.ts";
import { isEssenceIdInErrorMessage } from "../../utilities/isEssenceIdInErrorMessage.ts";
import {
  attemptToHandleEssenceReturnStatusAndErrors,
  type StatusAndErrors,
} from "../../utilities/requestEssence.ts";
import {
  attemptToUpdateItemReturnStatusAndErrorsById,
  requestItemUpdate,
} from "../../utilities/requestItem.ts";
import { UNAVAILABLE_ITEM_ID } from "../../utilities/sharedConstants.ts";

const PROVIDED_ITEM_NAME = "Water the flowers";
const PROVIDED_ITEM_REASON_FOR_LATEST_UPDATE = "To add 'the'.";
const INCORRECT_ITEM_ID = "incorrect-item-id";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

const provideUpdateWithId = (data: TestData, id: string): TestData => ({
  ...data,
  id,
  svernikData: {
    [CONTENT]: PROVIDED_ITEM_NAME,
    [REASON_FOR_LATEST_UPDATE]: PROVIDED_ITEM_REASON_FOR_LATEST_UPDATE,
  },
});

When("I provide an update without providing item id", (data: TestData): TestData =>
  provideUpdateWithId(data, ""));

Then("my request is interpreted as an attempt to update /items", async (data: TestData): Promise<TestData> => {
  const updateResult = await requestItemUpdate(
    sessionTokenOf(data),
    data.id as string,
    data.svernikData,
  );
  const location = extractLocationHeader(updateResult);
  is(
    equalsValue(PERMANENT_REDIRECT, updateResult.status),
    `Expected HTTP ${PERMANENT_REDIRECT}, got ${updateResult.status}.`,
  );
  is(
    equalsValue(ROUTES.items, location),
    `Expected the Location header to be ${JSON.stringify(ROUTES.items)}, got ${JSON.stringify(location)}.`,
  );
  return { location, svernikData: data.svernikData };
});

Then("I attempt to do the update to /items as interpreted", async (data: TestData): Promise<StatusAndErrors> => {
  const { location, svernikData } = data;
  return attemptToHandleEssenceReturnStatusAndErrors(
    await request("PATCH", `${serverUrl()}${location as string}`, {
      body: svernikData,
      token: sessionTokenOf(data),
    }),
  );
});

When("I provide an update using the incorrect item id", (data: TestData): TestData =>
  provideUpdateWithId(data, INCORRECT_ITEM_ID));

Then("my attempt to update an item fails", async (data: TestData): Promise<StatusAndErrors> =>
  attemptToUpdateItemReturnStatusAndErrorsById(
    sessionTokenOf(data),
    data.id as string,
    data.svernikData,
  ));

Then("I see the incorrect item's id in the error message", (data: TestData): TestData => {
  isEssenceIdInErrorMessage(
    data as unknown as { failedActionsAttempt: unknown[] },
    INCORRECT_ITEM_ID,
  );
  return data;
});

When("I provide an update to non-existing item", (data: TestData): TestData =>
  provideUpdateWithId(data, UNAVAILABLE_ITEM_ID));

When("I provide an update to non-existing item with incorrect data", (data: TestData): TestData => ({
  ...data,
  id: UNAVAILABLE_ITEM_ID,
  svernikData: { [CONTENT]: false },
}));
