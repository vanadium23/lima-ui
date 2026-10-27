// User registration / verification / password-reset domain logic.
// Mirrors, 1:1 by function:
//  - src/auth/users/create.clj (create-user-from-raw-data)
//  - src/auth/users/update.clj (update-user-from-raw-data)
//  - src/auth/users/verify.clj (verify-user-email-from-raw-data)
//  - src/auth/users/reset_password.clj (request-password-reset-from-raw-data)
//  - src/auth/users/reset_password_confirm.clj
//  - src/auth/errors/user_email_errors_gatherer.clj (+ login twin)
//  - src/auth/errors/user_password_errors_gatherer.clj
//  - src/auth/errors/token_errors_gatherer.clj
//  - src/auth/errors/password_reset_errors_gatherer.clj
// gather-field-errors discipline (svernik/errors/utilities.clj): the
// FIRST firing predicate decides; at most ONE error per gatherer call.
import bcrypt from "bcryptjs";
import type { Db } from "mongodb";
import {
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_RESET_ERRORS,
  TOKEN_ERRORS,
  USER_ERRORS,
} from "../domain/constants.ts";
import {
  CREATED_AT_FIELD,
  EMAIL_FIELD,
  EMAIL_VERIFIED_FIELD,
  ID_FIELD,
  MONGO_ID_FIELD,
  NAME_FIELD,
  PASSWORD_FIELD,
  TOKEN_FIELD,
  VERSION_ID_FIELD,
} from "../domain/fields.ts";
import {
  PASSWORD_RESET_TOKEN_TYPE,
  REGISTRATION_TOKEN_TYPE,
  createToken,
  findAndDeleteToken,
  findToken,
} from "../domain/token.ts";
import { generateUniqueEssenceId } from "../domain/essences.ts";
import { nowISOString } from "../utilities/time.ts";
import type { ErrorPayload } from "./middleware.ts";
import type { RawEssence } from "../domain/svernik.ts";
import type { SortedJSON } from "../utilities/json.ts";

export type { ErrorPayload };

const copy = (error: { id: string; text: string }): ErrorPayload => ({
  ...error,
});

// ===== string-measurements.clj / utilities.clj predicates =====

// missing?: (complement contains?) — the key must be ABSENT.
const missing = (data: RawEssence, field: string): boolean =>
  !(field in data);

// empty-as-string?: nil and "" are empty; everything else (numbers,
// bools, {} / [] printing as "{...}"/"[...]") is NOT.
const emptyAsString = (data: RawEssence, field: string): boolean => {
  if (!(field in data)) {
    return false;
  }
  const value = data[field];
  return value === null || value === "";
};

// contains-and-incorrect?: present AND not a string
// (auth.domain.user/email + password specs are not-empty-string?).
const containsAndIncorrect = (data: RawEssence, field: string): boolean =>
  field in data && typeof data[field] !== "string";

// ===== gatherers =====

// user-email-errors-gatherer: email checks in donor order; the
// already-exists check is a DB lookup INSIDE the gather (after
// invalid) and reports the anti-enumeration email-general-error.
export const gatherEmailErrors = async (
  database: Db,
  userData: RawEssence,
): Promise<ErrorPayload[]> => {
  if (missing(userData, "email")) {
    return [copy(USER_ERRORS.emailMissing)];
  }
  if (emptyAsString(userData, "email")) {
    return [copy(USER_ERRORS.emailEmpty)];
  }
  if (containsAndIncorrect(userData, "email")) {
    return [copy(USER_ERRORS.emailIncorrect)];
  }
  const email = userData.email as string;
  // email-invalid?: (re-matches #".+@.+\..+" email) is nil.
  if (!/.+@.+\..+/.test(email)) {
    return [copy(USER_ERRORS.emailInvalid)];
  }
  // email-already-exists?: (not (nil? (find-user-by-email email))).
  const existing = await database
    .collection("users")
    .findOne({ email });
  if (existing !== null) {
    return [copy(USER_ERRORS.emailGeneralError)];
  }
  return [];
};

// gather-login-email-errors: the same vector WITHOUT the DB check.
export const gatherLoginEmailErrors = (data: RawEssence): ErrorPayload[] => {
  if (missing(data, "email")) {
    return [copy(USER_ERRORS.emailMissing)];
  }
  if (emptyAsString(data, "email")) {
    return [copy(USER_ERRORS.emailEmpty)];
  }
  if (containsAndIncorrect(data, "email")) {
    return [copy(USER_ERRORS.emailIncorrect)];
  }
  if (!/.+@.+\..+/.test(typeof data.email === "string" ? data.email : "")) {
    return [copy(USER_ERRORS.emailInvalid)];
  }
  return [];
};

// user-password-errors-gatherer: full vector incl. weak/too-long/
// confirmation-mismatch (registration + reset-confirm use it).
export const gatherPasswordErrors = (data: RawEssence): ErrorPayload[] => {
  if (missing(data, "password")) {
    return [copy(USER_ERRORS.passwordMissing)];
  }
  if (emptyAsString(data, "password")) {
    return [copy(USER_ERRORS.passwordEmpty)];
  }
  if (containsAndIncorrect(data, "password")) {
    return [copy(USER_ERRORS.passwordIncorrect)];
  }
  const password = data.password as string;
  // too-short-string? with static-config :password-min-length 8.
  if (PASSWORD_MIN_LENGTH > password.length) {
    return [copy(USER_ERRORS.passwordWeak)];
  }
  // too-long-string? with static-config :password-max-length 64.
  if (PASSWORD_MAX_LENGTH < password.length) {
    return [copy(USER_ERRORS.passwordTooLong)];
  }
  // password-confirmation-mismatch?: (not= password password-confirmation).
  if (password !== data["passwordConfirmation"]) {
    return [copy(USER_ERRORS.passwordConfirmationMismatch)];
  }
  return [];
};

// token-errors-gatherer: missing → empty → incorrect (non-string) →
// invalid (no token document in the DB).
export const gatherTokenErrors = async (
  database: Db,
  data: RawEssence,
): Promise<ErrorPayload[]> => {
  if (missing(data, "token")) {
    return [copy(TOKEN_ERRORS.tokenMissing)];
  }
  if (emptyAsString(data, "token")) {
    return [copy(TOKEN_ERRORS.tokenEmpty)];
  }
  if (typeof data.token !== "string") {
    return [copy(TOKEN_ERRORS.tokenIncorrect)];
  }
  if ((await findToken(database, data.token)) === null) {
    return [copy(TOKEN_ERRORS.tokenInvalid)];
  }
  return [];
};

// ===== database.users (find / insert / update) =====

export interface UserDocument {
  [MONGO_ID_FIELD]: string;
  [ID_FIELD]: string;
  [VERSION_ID_FIELD]: string;
  [EMAIL_FIELD]: string;
  [EMAIL_VERIFIED_FIELD]: boolean;
  [PASSWORD_FIELD]: string;
  [NAME_FIELD]: string;
  [CREATED_AT_FIELD]: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  [key: string]: string;
}

const usersCollection = (database: Db) =>
  database.collection<UserDocument>("users");

// find-user (database.users.find): user ids are "user-<ObjectId>"
// strings stored in _id; no newVersionId filtering for users.
const findUser = async (
  database: Db,
  userId: string,
): Promise<UserDocument | null> =>
  usersCollection(database).findOne<UserDocument>({
    [ID_FIELD]: userId,
  } as never);

// hash-password (auth.utilities.password-management): bcrypt with the
// same work factor the dev-user seeding already uses (ADR-0001).
export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 12);

// auth.users.create/create-user-from-valid-data: id = version-id =
// generated "user-…" string, email-verified false, empty name.
const createUserFromValidData = async (
  userData: RawEssence,
): Promise<UserDocument> => {
  const userId = generateUniqueEssenceId("user");
  return {
    [MONGO_ID_FIELD]: userId,
    [ID_FIELD]: userId,
    [VERSION_ID_FIELD]: userId,
    [EMAIL_FIELD]: userData.email as string,
    [EMAIL_VERIFIED_FIELD]: false,
    [PASSWORD_FIELD]: await hashPassword(userData.password as string),
    [NAME_FIELD]: "",
    [CREATED_AT_FIELD]: nowISOString(),
  };
};

// prepare-essence-as-new-mongo-document discipline: _id = version-id,
// explicit id field, no state fields — the document IS the interface
// shape above, inserted as-is.
const insertUser = async (
  database: Db,
  user: UserDocument,
): Promise<UserDocument> => {
  await usersCollection(database).insertOne(user as never);
  return user;
};

// ===== use-cases =====

export interface AuthActionDependencies {
  database: Db;
  secret: string;
}

export type AuthActionResult =
  | { errors: ErrorPayload[] }
  | { errors?: undefined; [key: string]: SortedJSON | undefined };

// create-user-from-raw-data + route insert + token + email live in the
// route (users.clj order); here: gather → user document.
export const createUserFromRawData = async (
  database: Db,
  userData: RawEssence,
): Promise<{ errors: ErrorPayload[] } | { user: UserDocument }> => {
  const emailErrors = await gatherEmailErrors(database, userData);
  const passwordErrors = gatherPasswordErrors(userData);
  // (juxt gather-email gather-password) → flatten: email errors win.
  const errors = [...emailErrors, ...passwordErrors];
  if (errors.length > 0) {
    return { errors };
  }
  return { user: await createUserFromValidData(userData) };
};

// database.users.update/update-user!-set-verified.
const updateUserSetVerified = async (
  database: Db,
  userId: string,
): Promise<void> => {
  await usersCollection(database).updateOne(
    { [ID_FIELD]: userId } as never,
    { $set: { [EMAIL_VERIFIED_FIELD]: true } } as never,
  );
};

// database.users.update/update-user!-set-name → re-read (find-user).
const updateUserSetName = async (
  database: Db,
  userId: string,
  name: string,
): Promise<UserDocument | null> => {
  await usersCollection(database).updateOne(
    { [ID_FIELD]: userId } as never,
    { $set: { [NAME_FIELD]: name } } as never,
  );
  return findUser(database, userId);
};

// database.users.update/update-user-password!.
const updateUserPassword = async (
  database: Db,
  userId: string,
  hashedPassword: string,
): Promise<void> => {
  await usersCollection(database).updateOne(
    { [ID_FIELD]: userId } as never,
    { $set: { [PASSWORD_FIELD]: hashedPassword } } as never,
  );
};

// auth.users.update gather: a COND, first match wins.
const gatherUserUpdateErrors = (
  userData: RawEssence,
): { errors: ErrorPayload[]; notImplemented: boolean } => {
  if (Array.isArray(userData) || typeof userData !== "object" ||
    userData === null) {
    return { errors: [copy(USER_ERRORS.userUpdateIncorrect)],
      notImplemented: false };
  }
  if ("password" in userData) {
    return { errors: [copy(USER_ERRORS.passwordUpdateNotImplemented)],
      notImplemented: true };
  }
  if ("email" in userData) {
    return { errors: [copy(USER_ERRORS.emailUpdateNotAllowed)],
      notImplemented: false };
  }
  if (!("name" in userData)) {
    return { errors: [copy(USER_ERRORS.userUpdateEmpty)],
      notImplemented: false };
  }
  if (typeof userData.name !== "string") {
    return { errors: [copy(USER_ERRORS.nameIncorrect)],
      notImplemented: false };
  }
  if (userData.name.length > NAME_MAX_LENGTH) {
    return { errors: [copy(USER_ERRORS.nameTooLong)], notImplemented: false };
  }
  return { errors: [], notImplemented: false };
};

// update-user-from-raw-data: errors (501-class flagged) or the re-read
// {id, email, name} profile.
export const updateUserFromRawData = async (
  database: Db,
  userData: unknown,
  currentUserId: string,
): Promise<
  { errors: ErrorPayload[]; notImplemented: boolean } | { profile: UserProfile }
> => {
  const gathered = gatherUserUpdateErrors(
    (userData ?? {}) as RawEssence,
  );
  if (gathered.errors.length > 0) {
    return gathered;
  }
  const name = (userData as RawEssence).name;
  // new-name: (or (:name user-data) "") — "" already passed the checks.
  const updated = await updateUserSetName(
    database,
    currentUserId,
    typeof name === "string" ? name : "",
  );
  if (updated === null) {
    return { errors: [copy(USER_ERRORS.userUpdateIncorrect)],
      notImplemented: false };
  }
  return {
    profile: {
      id: updated[ID_FIELD],
      email: updated[EMAIL_FIELD],
      name: updated[NAME_FIELD],
    } as UserProfile,
  };
};

export interface VerifyOutcome {
  token: string;
  createdAt: string;
}

// auth.users.verify/verify-user-email: token is consumed FIRST
// (findOneAndDelete), then the user is verified, then a session is
// created (age 0 via the default arity).
// verify-email gather: juxt(token-gatherer) only — NO non-map guard,
// mirroring the donor (verify.clj). Scalars (numbers/booleans/strings)
// make the Clojure original throw → 500 general-svernik-error; the TS
// port reaches the same statuses accidentally (TypeError → Fastify
// handler). Do NOT add a map-guard here: it would diverge from donor
// behavior on [] / 123 / true / "garbage".
export const verifyUserEmailFromRawData = async (
  dependencies: AuthActionDependencies,
  rawData: RawEssence,
  request: { userAgent: string; ip: string },
  createSession: (options: {
    userId: string;
    userAgent: string;
    ip: string;
  }) => Promise<VerifyOutcome>,
): Promise<AuthActionResult> => {
  const errors = await gatherTokenErrors(dependencies.database, rawData);
  if (errors.length > 0) {
    return { errors };
  }
  const usedToken = await findAndDeleteToken(
    dependencies.database,
    rawData.token as string,
  );
  // gatherTokenErrors already confirmed existence.
  const userId = usedToken?.userId ?? "";
  await updateUserSetVerified(dependencies.database, userId);
  const session = await createSession({
    userId,
    userAgent: request.userAgent,
    ip: request.ip,
  });
  return { [TOKEN_FIELD]: session.token, createdAt: session.createdAt };
};

export type PasswordResetRequestResult =
  | { errors: ErrorPayload[] }
  | { sent: true; email: string }
  | { message: string };

// auth.users.reset-password/request-password-reset-from-raw-data:
// gather (non-map → password-reset-incorrect, else login-email
// errors); ALWAYS {message "ok"} on success — the email goes out only
// for a real user (anti-enumeration). The real-user case is reported
// as {sent} so the route can create the token + send the email.
export const requestPasswordResetFromRawData = async (
  database: Db,
  rawData: unknown,
): Promise<PasswordResetRequestResult> => {
  if (rawData === null || typeof rawData !== "object" ||
    Array.isArray(rawData)) {
    return { errors: [copy(PASSWORD_RESET_ERRORS.passwordResetIncorrect)] };
  }
  const data = rawData as RawEssence;
  const errors = gatherLoginEmailErrors(data);
  if (errors.length > 0) {
    return { errors };
  }
  const email = data.email as string;
  const user = await database
    .collection("users")
    .findOne({ email });
  if (user !== null) {
    return {
      sent: true,
      email,
    };
  }
  return { message: "ok" };
};

// The token + email side-effect split out so the route can send after
// the always-ok response shape is decided (same anti-enumeration
// semantics: create-token + send-email ONLY for a real user).
export const createPasswordResetToken = (database: Db, userId: string):
  Promise<string> => createToken(database, PASSWORD_RESET_TOKEN_TYPE, userId);

// auth.users.reset-password-confirm gather: non-map →
// password-reset-incorrect; else token + password vectors CONCATENATED
// (donor juxt flatten: bad token AND bad password → both errors).
const gatherResetConfirmErrors = async (
  database: Db,
  rawData: RawEssence,
): Promise<ErrorPayload[]> => {
  const tokenErrors = await gatherTokenErrors(database, rawData);
  const passwordErrors = gatherPasswordErrors(rawData);
  return [...tokenErrors, ...passwordErrors];
};

// reset-password-confirm-from-raw-data: consume token → hash the new
// password → session (age 0).
export const resetPasswordConfirmFromRawData = async (
  dependencies: AuthActionDependencies,
  rawData: RawEssence,
  request: { userAgent: string; ip: string },
  createSession: (options: {
    userId: string;
    userAgent: string;
    ip: string;
  }) => Promise<VerifyOutcome>,
): Promise<AuthActionResult> => {
  // donor reset_password_confirm.clj gather: non-map body →
  // password-reset-incorrect (BEFORE any token/password checks).
  if (rawData === null || typeof rawData !== "object" ||
    Array.isArray(rawData)) {
    return { errors: [copy(PASSWORD_RESET_ERRORS.passwordResetIncorrect)] };
  }
  const errors = await gatherResetConfirmErrors(
    dependencies.database,
    rawData,
  );
  if (errors.length > 0) {
    return { errors };
  }
  const usedToken = await findAndDeleteToken(
    dependencies.database,
    rawData.token as string,
  );
  const userId = usedToken?.userId ?? "";
  await updateUserPassword(
    dependencies.database,
    userId,
    await hashPassword(rawData.password as string),
  );
  const session = await createSession({
    userId,
    userAgent: request.userAgent,
    ip: request.ip,
  });
  return { [TOKEN_FIELD]: session.token, createdAt: session.createdAt };
};

// Registration token creator kept next to its reset twin.
export const createRegistrationToken = (database: Db, userId: string):
  Promise<string> => createToken(database, REGISTRATION_TOKEN_TYPE, userId);
