// Ported from features/user_login/user_login_steps.clj — complete.
import { And, Then, When, is, equalsValue, type TestData } from "../../support/world.ts";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../../support/config.ts";
import {
  attemptToLoginUserReturnStatusAndErrors,
  requestLoginUserParsed,
} from "../../utilities/requestAuth.ts";
import { requestUserProfileParsed } from "../../utilities/requestUser.ts";
import { EMAIL, PASSWORD } from "../../utilities/userRawDataDescription.ts";

const userDataMap = (data: TestData): Record<string, unknown> =>
  (data.userData as Record<string, unknown> | undefined) ?? {};

const assocInUserData = (data: TestData, field: string, value: unknown): TestData => ({
  ...data,
  userData: { ...userDataMap(data), [field]: value },
});

When("I want to login as a user", (data: TestData): TestData => ({
  ...data,
  userData: {},
}));

Then("my attempt to login fails", (data: TestData): Promise<unknown> =>
  attemptToLoginUserReturnStatusAndErrors(data));

Then("I successfully login as a user", (data: TestData): Promise<unknown> =>
  requestLoginUserParsed(data));

And("I provide the user's email", (data: TestData): TestData =>
  assocInUserData(data, EMAIL, TEST_USER_EMAIL));

And("I provide the user's password", (data: TestData): TestData =>
  assocInUserData(data, PASSWORD, TEST_USER_PASSWORD));

And("I save token from login response", (data: TestData): TestData => ({
  ...data,
  auth: {
    ...(data.auth as Record<string, unknown> | undefined),
    sessionToken: (data.loginResultParsed as { token?: string })?.token,
  },
}));

Then("I successfully see my profile", async (data: TestData): Promise<TestData> => {
  const auth = data.auth as { sessionToken?: string } | undefined;
  const profileResult = await requestUserProfileParsed(auth?.sessionToken);
  return { ...data, ...profileResult };
});

And("I see my email", (data: TestData): TestData => {
  const profileEmail = (data.profileResultParsed as Record<string, unknown> | null)?.[EMAIL];
  is(
    equalsValue(TEST_USER_EMAIL, profileEmail),
    `Expected the profile email ${JSON.stringify(TEST_USER_EMAIL)}, got ${JSON.stringify(profileEmail)}.`,
  );
  return data;
});

And("I don't see my password hash", (data: TestData): TestData => {
  const profilePassword = (data.profileResultParsed as Record<string, unknown> | null)?.[PASSWORD];
  is(
    profilePassword === undefined || profilePassword === null,
    `Expected no password hash in the profile, got: ${JSON.stringify(profilePassword)}.`,
  );
  return data;
});
