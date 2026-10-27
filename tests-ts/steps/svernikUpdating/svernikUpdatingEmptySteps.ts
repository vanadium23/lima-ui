// Ported from features/svernik_updating/svernik_updating_empty_steps.clj
// — complete.
import { But, Then, is, type TestData } from "../../support/world.ts";
import {
  attemptToUpdateEssenceWithAnyCombinationOfUserProvidedFields,
} from "../../utilities/requestEssence.ts";
import {
  attemptToUpdateListReturnStatusAndErrors,
  requestListBasedDataListUpdate,
} from "../../utilities/requestList.ts";
import { SVERNIK_USER_PROVIDED_KEYWORDS } from "../../utilities/validators.ts";

But("I provide an empty update to essence", (essenceRequestData: TestData): TestData =>
  essenceRequestData);

Then("my attempt to update a svernik fails", async (data: TestData): Promise<TestData> => {
  const auth = data.auth as { sessionToken?: string } | undefined;
  const svernikData = data.svernikData;
  const { status, failedActionsAttempt } = await attemptToUpdateListReturnStatusAndErrors(
    auth?.sessionToken,
    data.id as string,
    svernikData,
  );
  return { ...data, status, failedActionsAttempt, originalData: svernikData };
});

Then(
  "I see the following HTTP status code: {int}",
  (data: TestData, expectedHttpStatusCode: number): TestData => {
    is(
      data.status === expectedHttpStatusCode,
      `Expected HTTP status ${expectedHttpStatusCode}, got ${data.status}.`,
    );
    return data;
  },
);

But("I provide to essence the same data which is in it", (data: TestData): TestData => ({
  id: data.id,
  svernikData: data.essence,
  auth: data.auth,
}));

Then("my attempt to update a svernik with any set of the same data fails", (
  svernikUpdateData: TestData,
): Promise<unknown> =>
  attemptToUpdateEssenceWithAnyCombinationOfUserProvidedFields(
    (token, id, update) => requestListBasedDataListUpdate(token, id, update),
    SVERNIK_USER_PROVIDED_KEYWORDS,
    svernikUpdateData as {
      auth?: { sessionToken?: string };
      id: string;
      svernikData: Record<string, unknown>;
    },
  ));
