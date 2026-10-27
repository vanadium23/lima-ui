// Ported from
// features/svernik_updating/svernik_updating_non_existing_steps.clj
// — complete.
import { Then, When, is, equalsValue, type TestData } from "../../support/world.ts";
import {
  NAME,
  REASON_FOR_LATEST_UPDATE,
} from "../../../src-ts/domain/svernik.ts";
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
import { requestListBasedDataListUpdate } from "../../utilities/requestList.ts";
import {
  INCORRECT_SVERNIK_ID,
  UNAVAILABLE_SVERNIK_ID,
} from "../../utilities/sharedConstants.ts";

const PROVIDED_NAME = "Implementing mocks";
const PROVIDED_REASON_FOR_LATEST_UPDATE = "To specify more descriptive name.";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

const provideUpdateWithId = (data: TestData, id: string): TestData => ({
  id,
  svernikData: {
    [NAME]: PROVIDED_NAME,
    [REASON_FOR_LATEST_UPDATE]: PROVIDED_REASON_FOR_LATEST_UPDATE,
  },
  auth: data.auth,
});

When("I provide an update to non-existing svernik", (data: TestData): TestData =>
  provideUpdateWithId(data, UNAVAILABLE_SVERNIK_ID));

When("I provide an update without providing svernik id", (data: TestData): TestData =>
  provideUpdateWithId(data, ""));

Then("my request is interpreted as an attempt to update /lists", async (data: TestData): Promise<TestData> => {
  const { id, svernikData } = data;
  const updateResult = await requestListBasedDataListUpdate(
    sessionTokenOf(data),
    id as string,
    svernikData,
  );
  const location = extractLocationHeader(updateResult);
  is(
    equalsValue(PERMANENT_REDIRECT, updateResult.status),
    `Expected HTTP ${PERMANENT_REDIRECT}, got ${updateResult.status}.`,
  );
  is(
    equalsValue(ROUTES.lists, location),
    `Expected the Location header to be ${JSON.stringify(ROUTES.lists)}, got ${JSON.stringify(location)}.`,
  );
  return { location, svernikData };
});

Then("I attempt to do the update to /lists as interpreted", async (data: TestData): Promise<StatusAndErrors> => {
  const { location, svernikData } = data;
  return attemptToHandleEssenceReturnStatusAndErrors(
    await request("PATCH", `${serverUrl()}${location as string}`, {
      body: svernikData,
      token: sessionTokenOf(data),
    }),
  );
});

When("I provide an update using the incorrect svernik id", (data: TestData): TestData =>
  provideUpdateWithId(data, INCORRECT_SVERNIK_ID));

Then("I see the incorrect svernik's id in the error message", (data: TestData): TestData => {
  isEssenceIdInErrorMessage(
    data as unknown as { failedActionsAttempt: unknown[] },
    INCORRECT_SVERNIK_ID,
  );
  return data;
});
