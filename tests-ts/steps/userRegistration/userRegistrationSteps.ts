// Ported from features/user_registration/user_registration_steps.clj
// — complete.
import {
  And,
  But,
  Then,
  When,
  is,
  equalsValue,
  type TestData,
} from "../../support/world.ts";
import {
  buildRandomString,
  createRandomString,
} from "../../utilities/buildRandom.ts";
import { assocInParsedFromJsonIfNotAbsent } from "../../utilities/handleRawData.ts";
import {
  attemptToVerifyEmailReturnStatusAndErrors,
  requestVerifyEmailParsed,
} from "../../utilities/requestAuth.ts";
import {
  checkRegistrationEmailReceived,
  extractTokenFromEmail,
  requestReceivedEmails,
} from "../../utilities/requestEmail.ts";
import {
  attemptToRegisterUserReturnStatusAndErrors,
  requestRegisterUserParsed,
} from "../../utilities/requestUser.ts";
import {
  EMAIL,
  PASSWORD,
  PASSWORD_CONFIRMATION,
} from "../../utilities/userRawDataDescription.ts";

export const CORRECT_EMAIL = "a@a.ru";
export const CORRECT_PASSWORD = "StrongPassword123!";

export const INCORRECT_EMAIL = "invalid-email";
export const WEAK_PASSWORD = "123";

const MISTYPED_SUFFIX = "typo";
const RANDOM_EMAIL_DOMAIN = "@example.com";

const userDataMap = (data: TestData): Record<string, unknown> =>
  (data.userData as Record<string, unknown> | undefined) ?? {};

const assocInUserData = (data: TestData, field: string, value: unknown): TestData => ({
  ...data,
  userData: { ...userDataMap(data), [field]: value },
});

When("I want to register as a user", (): TestData => ({ userData: {} }));

And("I provide a correct email", (userData: TestData): TestData =>
  assocInUserData(userData, EMAIL, CORRECT_EMAIL));

And("I provide an incorrect email", (userData: TestData): TestData =>
  assocInUserData(userData, EMAIL, INCORRECT_EMAIL));

And("I provide a correct password", (userData: TestData): TestData =>
  assocInUserData(userData, PASSWORD, CORRECT_PASSWORD));

And("I repeat a correct password", (userData: TestData): TestData =>
  assocInUserData(userData, PASSWORD_CONFIRMATION, CORRECT_PASSWORD));

Then("my attempt to register fails", (userData: TestData): Promise<unknown> =>
  attemptToRegisterUserReturnStatusAndErrors(userData));

Then("I successfully registered as a user", (userData: TestData): Promise<unknown> =>
  requestRegisterUserParsed(userData));

And("I provide a weak password", (userData: TestData): TestData =>
  assocInUserData(userData, PASSWORD, WEAK_PASSWORD));

And("I repeat a weak password", (userData: TestData): TestData =>
  assocInUserData(userData, PASSWORD_CONFIRMATION, WEAK_PASSWORD));

And("I mistype a correct password", (userData: TestData): TestData =>
  assocInUserData(userData, PASSWORD_CONFIRMATION, CORRECT_PASSWORD + MISTYPED_SUFFIX));

And("I repeat current password", (userData: TestData): TestData =>
  assocInUserData(userData, PASSWORD_CONFIRMATION, userDataMap(userData)[PASSWORD]));

But("I provide the absent, empty or incorrect password: {}", (userData: TestData, password: string): TestData =>
  assocInParsedFromJsonIfNotAbsent(userData, ["userData", PASSWORD], password));

But("I provide the absent, empty or incorrect email: {}", (userData: TestData, email: string): TestData =>
  assocInParsedFromJsonIfNotAbsent(userData, ["userData", EMAIL], email));

And("I provide a random password with length: {int}", (userData: TestData, passwordLength: number): TestData =>
  assocInUserData(userData, PASSWORD, createRandomString(passwordLength)));

And("I provide a random correct email", (userData: TestData): TestData =>
  assocInUserData(userData, EMAIL, buildRandomString() + RANDOM_EMAIL_DOMAIN));

Then("I check my emails", async (userData: TestData): Promise<TestData> => {
  const userEmail = userDataMap(userData)[EMAIL];
  const emails = await requestReceivedEmails();
  return { ...userData, emails, userEmail };
});

And("I see my registration email token", async (userData: TestData): Promise<TestData> => {
  const userEmail =
    (userData.userEmail as string | undefined) ??
    (userDataMap(userData)[EMAIL] as string);
  const registrationEmail = await checkRegistrationEmailReceived(userEmail);
  const token = extractTokenFromEmail(registrationEmail);
  is(
    registrationEmail !== null,
    `Registration email not found for: ${userEmail}`,
  );
  is(
    token !== undefined && token !== null,
    `Registration token not found in email: ${JSON.stringify(registrationEmail)}`,
  );
  return { ...userData, registrationEmail, registrationToken: token };
});

And("I try to register same email", (userData: TestData): TestData => userData);

Then("I successfully verify email with token", async (userData: TestData): Promise<TestData> => {
  const verifyResult = await requestVerifyEmailParsed(
    userData.registrationToken as string,
  );
  return { ...userData, ...verifyResult };
});

And("I save token from verification response", (userData: TestData): TestData => ({
  ...userData,
  auth: {
    ...(userData.auth as Record<string, unknown> | undefined),
    sessionToken: (userData.verifyResultParsed as { token?: string })?.token,
  },
}));

And("I see registration email in profile", (userData: TestData): TestData => {
  is(
    equalsValue(userDataMap(userData)[EMAIL], (userData.profileResultParsed as Record<string, unknown> | null)?.[EMAIL]),
    `Expected the profile email ${JSON.stringify(userDataMap(userData)[EMAIL])}, got ${JSON.stringify((userData.profileResultParsed as Record<string, unknown> | null)?.[EMAIL])}.`,
  );
  return userData;
});

Then("my attempt to verify email with same token fails", (userData: TestData): Promise<unknown> =>
  attemptToVerifyEmailReturnStatusAndErrors(userData.registrationToken as string));
