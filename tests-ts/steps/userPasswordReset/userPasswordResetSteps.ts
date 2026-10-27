// Ported from features/user_password_reset/user_password_reset_steps.clj
// — complete. Email flows poll the shared MailSlurper instance via the
// ported requestEmail utility, mirroring the donor.
import {
  And,
  But,
  Given,
  Then,
  When,
  is,
  type TestData,
} from "../../support/world.ts";
import { TOKEN_FIELD } from "../../../src-ts/domain/fields.ts";
import { buildRandomString } from "../../utilities/buildRandom.ts";
import { assocInParsedFromJsonIfNotAbsent } from "../../utilities/handleRawData.ts";
import {
  attemptToRequestPasswordResetConfirmReturnStatusAndErrors,
  attemptToRequestPasswordResetReturnStatusAndErrors,
  requestPasswordResetConfirmParsed,
  requestPasswordResetParsed,
} from "../../utilities/requestAuth.ts";
import {
  checkNoPasswordResetEmail,
  checkPasswordResetEmailReceived,
  clearEmails,
  extractResetTokenFromEmail,
} from "../../utilities/requestEmail.ts";
import { requestRegisterUserParsed } from "../../utilities/requestUser.ts";
import {
  EMAIL,
  PASSWORD,
  PASSWORD_CONFIRMATION,
} from "../../utilities/userRawDataDescription.ts";

const CORRECT_PASSWORD = "StrongPassword123!";
const RANDOM_EMAIL_DOMAIN = "@example.com";
const MISMATCH_SUFFIX = "mismatch";

When("I want to request password reset", (): TestData => ({
  passwordResetData: {},
}));

Given("a user is registered", async (data: TestData): Promise<TestData> => {
  const email = buildRandomString() + RANDOM_EMAIL_DOMAIN;
  const userData = {
    [EMAIL]: email,
    [PASSWORD]: CORRECT_PASSWORD,
    [PASSWORD_CONFIRMATION]: CORRECT_PASSWORD,
  };
  const registerResult = await requestRegisterUserParsed({ userData });
  return {
    ...data,
    registeredUserData: userData,
    registeredUserResult: registerResult,
  };
});

And("I request password reset with the user's email", async (data: TestData): Promise<TestData> => {
  const email = (data.registeredUserData as Record<string, unknown>)[EMAIL] as string;
  const result = await requestPasswordResetParsed({ [EMAIL]: email });
  return { ...data, ...result };
});

Then("I see a password reset email with token", async (data: TestData): Promise<TestData> => {
  const email = (data.registeredUserData as Record<string, unknown>)[EMAIL] as string;
  const resetEmail = await checkPasswordResetEmailReceived(email);
  const token = extractResetTokenFromEmail(resetEmail);
  is(
    resetEmail !== undefined && resetEmail !== null,
    `Password reset email not found for: ${email}`,
  );
  is(
    token !== undefined && token !== null,
    `Password reset token not found in email: ${JSON.stringify(resetEmail)}`,
  );
  return { ...data, passwordResetEmail: resetEmail, passwordResetToken: token };
});

But("I request password reset with incorrect data: {}", (data: TestData, garbage: string): TestData => ({
  ...data,
  passwordResetData: JSON.parse(garbage),
}));

Then("my attempt to request password reset fails", (data: TestData): Promise<unknown> =>
  attemptToRequestPasswordResetReturnStatusAndErrors(data.passwordResetData));

And("I request password reset with unknown fields", (data: TestData): TestData => ({
  ...data,
  passwordResetData: { unknownField: "value" },
}));

But("I request password reset with email: {}", (data: TestData, email: string): TestData => ({
  ...data,
  passwordResetData: assocInParsedFromJsonIfNotAbsent({}, [EMAIL], email),
}));

When("I confirm password reset with the token and a new password", async (data: TestData): Promise<TestData> => {
  const result = await requestPasswordResetConfirmParsed({
    [TOKEN_FIELD]: data.passwordResetToken,
    [PASSWORD]: CORRECT_PASSWORD,
    [PASSWORD_CONFIRMATION]: CORRECT_PASSWORD,
  });
  return { ...data, ...result };
});

But("I confirm password reset with incorrect data: {}", (data: TestData, garbage: string): TestData => ({
  ...data,
  passwordResetConfirmData: JSON.parse(garbage),
}));

Then("my attempt to confirm password reset fails", (data: TestData): Promise<unknown> =>
  attemptToRequestPasswordResetConfirmReturnStatusAndErrors(data.passwordResetConfirmData));

But("I confirm password reset with token: {}", (data: TestData, token: string): TestData => {
  const confirmData = assocInParsedFromJsonIfNotAbsent(
    { [PASSWORD]: CORRECT_PASSWORD, [PASSWORD_CONFIRMATION]: CORRECT_PASSWORD },
    [TOKEN_FIELD],
    token,
  );
  return { ...data, passwordResetConfirmData: confirmData };
});

When("I confirm password reset with the same token and a new password", async (data: TestData): Promise<TestData> => {
  const confirmData = {
    [TOKEN_FIELD]: data.passwordResetToken,
    [PASSWORD]: CORRECT_PASSWORD,
    [PASSWORD_CONFIRMATION]: CORRECT_PASSWORD,
  };
  const result = await requestPasswordResetConfirmParsed(confirmData);
  return { ...data, ...result, passwordResetConfirmData: confirmData };
});

When("I confirm password reset with the token and password: {}", async (
  data: TestData,
  password: string,
): Promise<TestData> => {
  const confirmData = assocInParsedFromJsonIfNotAbsent(
    { [TOKEN_FIELD]: data.passwordResetToken, [PASSWORD_CONFIRMATION]: CORRECT_PASSWORD },
    [PASSWORD],
    password,
  );
  const result = await requestPasswordResetConfirmParsed(confirmData);
  return { ...data, ...result, passwordResetConfirmData: confirmData };
});

When("I confirm password reset with the token and mismatched passwords", async (data: TestData): Promise<TestData> => {
  const confirmData = {
    [TOKEN_FIELD]: data.passwordResetToken,
    [PASSWORD]: CORRECT_PASSWORD,
    [PASSWORD_CONFIRMATION]: CORRECT_PASSWORD + MISMATCH_SUFFIX,
  };
  const result = await requestPasswordResetConfirmParsed(confirmData);
  return { ...data, ...result, passwordResetConfirmData: confirmData };
});

When("I clear my email inbox", async (data: TestData): Promise<TestData> => {
  await clearEmails();
  return data;
});

When("I request password reset with an unregistered email", async (data: TestData): Promise<TestData> => {
  const email = buildRandomString() + RANDOM_EMAIL_DOMAIN;
  const result = await requestPasswordResetParsed({ [EMAIL]: email });
  return { ...data, ...result, unregisteredEmail: email };
});

And("I see no password reset email", async (data: TestData): Promise<TestData> => {
  await checkNoPasswordResetEmail(data.unregisteredEmail as string);
  return data;
});
