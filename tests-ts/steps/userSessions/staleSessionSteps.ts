// Ported from features/user_sessions/stale_sesion_steps.clj — complete.
//
// The session steps deliberately write the session docs straight into
// MongoDB from the harness (prepare_sessions_test_data parity: session
// creation from the user-id only, no password check) — the doc shape is
// shared by both backends, so the same seeding works against Clojure
// and TS alike. Expired/running-out ages mirror the donor:
// SESSION_MAX_AGE_DAYS days, and that minus 30 minutes.
import { createSession } from "../../../src-ts/auth/sessions.ts";
import { findUserByEmail } from "../../../src-ts/domain/user.ts";
import { SESSION_MAX_AGE_DAYS } from "../../../src-ts/domain/constants.ts";
import { appConfig } from "../../support/config.ts";
import { activeDatabase } from "../../support/runtime.ts";
import { And, Given, Then, When, type TestData } from "../../support/world.ts";
import { createRandomString } from "../../utilities/buildRandom.ts";
import { attemptToFetchUserProfileReturnStatusAndErrors } from "../../utilities/requestUser.ts";

const DEV_USERS_DATA: Readonly<Record<string, string>> = {
  "basic@lima.ooo": "devTest1",
  "pro@lima.ooo": "devTest1",
  "testBot@lima.ooo": "devTestBot0",
  "user@example.com": "correctPassword1",
  "other@example.com": "otherPassword1",
};

const SECONDS_PER_DAY = 24 * 60 * 60;
const HALF_AN_HOUR_IN_SECONDS = 30 * 60;
const EXPIRED_SESSION_AGE_IN_SECONDS = SESSION_MAX_AGE_DAYS * SECONDS_PER_DAY;
const RUNNING_OUT_SESSION_AGE_IN_SECONDS =
  EXPIRED_SESSION_AGE_IN_SECONDS - HALF_AN_HOUR_IN_SECONDS;
const RANDOM_SESSION_LENGTH = 32;

const devUserPassword = (email: string): string => {
  const password = DEV_USERS_DATA[email];
  if (password === undefined) {
    throw new Error(`Неизвестный тестовый пользователь: ${email}`);
  }
  return password;
};

// tests.prepare-sessions-test-data create-session-for-email: session
// creation from the user-id only, no password verification.
const createSessionForEmail = async (
  email: string,
  sessionAgeInSeconds: number,
): Promise<string> => {
  const user = await findUserByEmail(activeDatabase(), email);
  if (user === null) {
    throw new Error(`Тестовый пользователь не найден в базе: ${email}`);
  }
  const session = await createSession(activeDatabase(), {
    secret: appConfig().sessionHmacSecret,
    userId: user.id,
    sessionAgeInSeconds,
    userAgent: "",
    ip: "",
  });
  if (session.token === undefined) {
    throw new Error(`Сессия создана без токена: ${email}`);
  }
  return session.token;
};

const withSessionToken = (data: TestData, sessionToken: string): TestData => ({
  ...data,
  auth: {
    ...(data.auth as Record<string, unknown> | undefined),
    sessionToken,
  },
});

const withSessionForEmail = async (
  data: TestData,
  email: string | undefined,
  sessionAgeInSeconds: number,
): Promise<TestData> =>
  withSessionToken(
    data,
    await createSessionForEmail(email ?? "", sessionAgeInSeconds),
  );

Given("I am {string}", async (data: TestData, email: string): Promise<TestData> => {
  const password = devUserPassword(email);
  const user = await findUserByEmail(activeDatabase(), email);
  if (user === null) {
    throw new Error(`Тестовый пользователь не найден в базе: ${email}`);
  }
  const sessionToken = await createSessionForEmail(email, 0);
  return {
    ...data,
    auth: {
      ...(data.auth as Record<string, unknown> | undefined),
      email,
      password,
      userId: user.id,
      sessionToken,
    },
  };
});

And("I have an expired session", async (data: TestData): Promise<TestData> => {
  const auth = data.auth as { email?: string } | undefined;
  return withSessionForEmail(data, auth?.email, EXPIRED_SESSION_AGE_IN_SECONDS);
});

And("I have a random session", (data: TestData): TestData =>
  withSessionToken(data, createRandomString(RANDOM_SESSION_LENGTH)));

And("I have the running out session", async (data: TestData): Promise<TestData> => {
  const auth = data.auth as { email?: string } | undefined;
  return withSessionForEmail(data, auth?.email, RUNNING_OUT_SESSION_AGE_IN_SECONDS);
});

When("I try to see my profile", (data: TestData): TestData => data);

Then("my attempt to see my profile fails", (data: TestData): Promise<unknown> => {
  const auth = data.auth as { sessionToken?: string } | undefined;
  return attemptToFetchUserProfileReturnStatusAndErrors(auth?.sessionToken);
});
