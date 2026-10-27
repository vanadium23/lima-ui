// Ported from features/user_updating/user_updating_steps.clj — complete.
import {
  And,
  But,
  Then,
  When,
  is,
  equalsValue,
  type TestData,
} from "../../support/world.ts";
import { assocInParsedFromJsonIfNotAbsent } from "../../utilities/handleRawData.ts";
import {
  attemptToUpdateUserReturnStatusAndErrors,
  requestUserUpdate,
  requestUserUpdateParsed,
} from "../../utilities/requestUser.ts";

const USER_UPDATE_DATA = "userUpdateData";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

const userUpdateDataOf = (data: TestData): unknown => data[USER_UPDATE_DATA];

But("I provide the incorrect user update data: {}", (data: TestData, garbage: string): TestData => ({
  ...data,
  [USER_UPDATE_DATA]: JSON.parse(garbage),
}));

And("I want to update user", (data: TestData): TestData => ({
  ...data,
  [USER_UPDATE_DATA]: {},
}));

And("I want to update the {string} user field with {}", (
  data: TestData,
  fieldName: string,
  fieldValue: string,
): TestData =>
  assocInParsedFromJsonIfNotAbsent(data, [USER_UPDATE_DATA, fieldName], fieldValue));

Then("my attempt to update user fails", async (data: TestData): Promise<TestData> => {
  const userUpdateData = userUpdateDataOf(data);
  const { status, failedActionsAttempt } =
    await attemptToUpdateUserReturnStatusAndErrors(sessionTokenOf(data), userUpdateData);
  return { ...data, status, failedActionsAttempt, originalData: userUpdateData };
});

Then("I successfully update my user name", async (data: TestData): Promise<TestData> => {
  const userUpdateData = userUpdateDataOf(data);
  const result = await requestUserUpdateParsed(sessionTokenOf(data), userUpdateData);
  is(
    equalsValue(result.status, 200),
    `Expected HTTP 200, got ${result.status}.`,
  );
  return { ...data, ...result, originalData: userUpdateData };
});

Then("my user name is {string}", (data: TestData, expectedName: string): TestData => {
  const hasUpdateResult = data.updateResultParsed !== undefined && data.updateResultParsed !== null;
  const hasProfileResult = data.profileResultParsed !== undefined && data.profileResultParsed !== null;
  if (hasUpdateResult) {
    const actualName = (data.updateResultParsed as Record<string, unknown>).name;
    is(
      equalsValue(expectedName, actualName),
      `Expected the updated user name ${JSON.stringify(expectedName)}, got ${JSON.stringify(actualName)}.`,
    );
  }
  if (hasProfileResult) {
    const actualName = (data.profileResultParsed as Record<string, unknown>).name;
    is(
      equalsValue(expectedName, actualName),
      `Expected the profile user name ${JSON.stringify(expectedName)}, got ${JSON.stringify(actualName)}.`,
    );
  }
  is(
    hasUpdateResult || hasProfileResult,
    "Expected either updateResultParsed or profileResultParsed.",
  );
  return data;
});

When("I want to update my user name again with the same data", (data: TestData): TestData => data);

Then("my attempt to update user password fails", async (data: TestData): Promise<TestData> => {
  const result = await requestUserUpdate(sessionTokenOf(data), userUpdateDataOf(data));
  return { ...data, status: result.status };
});
