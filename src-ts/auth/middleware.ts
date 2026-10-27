// Auth middleware + login logic. Mirrors src/server/middleware.clj
// (Bearer parsing, unauthorized body) and the login semantics of
// src/auth/user_sessions/login.clj: the first failing check wins,
// exactly one error is returned; the order is email checks, password
// checks, then user/password match.
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Db } from "mongodb";
import {
  compareUserPassword,
  createSession,
  verifySession,
} from "../auth/sessions.ts";
import { ERRORS, USER_ERRORS } from "../domain/constants.ts";
import {
  findUserByEmail,
  type AuthenticatedUser,
} from "../domain/user.ts";
import { ERRORS_FIELD } from "../domain/fields.ts";

declare module "fastify" {
  interface FastifyRequest {
    user: AuthenticatedUser | null;
  }
}

export type ErrorPayload = { id: string; text: string };

export const unauthorizedBody = (): {
  [ERRORS_FIELD]: ErrorPayload[];
} => ({ [ERRORS_FIELD]: [{ ...ERRORS.userUnauthorized }] });

// wrap-user-authentication: parse "Bearer <token>" and resolve the user
// for every request; 401s are the protected routes' own concern.
export const attachUser = async (
  database: Db,
  secret: string,
  request: FastifyRequest,
): Promise<void> => {
  request.user = null;
  const header = request.headers.authorization;
  const match = header === undefined ? null : /^Bearer (.+)$/.exec(header);
  if (match === null) {
    return;
  }
  const user = await verifySession(database, secret, match[1] ?? "");
  if (user !== null) {
    request.user = user;
  }
};

export const sendUnauthorized = (reply: FastifyReply): FastifyReply =>
  reply.code(401).send(unauthorizedBody());

export type LoginRawData = Record<string, unknown>;

const isPlainObject = (value: unknown): value is LoginRawData =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Present and not null/empty-string, but not a string either — the
// email-incorrect / password-incorrect Clojure checks.
const presentNonString = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== "" &&
  typeof value !== "string";

const stringOf = (value: unknown): string =>
  typeof value === "string" ? value : "";

const emailInvalid = (value: string): boolean => !/.+@.+\..+/.test(value);

// gather-field-errors: the first predicate that fires decides the error.
export const gatherLoginErrors = (rawData: LoginRawData): ErrorPayload[] => {
  const email = rawData.email;
  if (email === undefined) {
    return [{ ...USER_ERRORS.emailMissing }];
  }
  if (email === null || email === "") {
    return [{ ...USER_ERRORS.emailEmpty }];
  }
  if (presentNonString(email)) {
    return [{ ...USER_ERRORS.emailIncorrect }];
  }
  if (emailInvalid(stringOf(email))) {
    return [{ ...USER_ERRORS.emailInvalid }];
  }
  const password = rawData.password;
  if (password === undefined) {
    return [{ ...USER_ERRORS.passwordMissing }];
  }
  if (password === null || password === "") {
    return [{ ...USER_ERRORS.passwordEmpty }];
  }
  if (presentNonString(password)) {
    return [{ ...USER_ERRORS.passwordIncorrect }];
  }
  if (stringOf(password).length > 64) {
    return [{ ...USER_ERRORS.passwordTooLong }];
  }
  return [];
};

export interface LoginDependencies {
  database: Db;
  secret: string;
}

export interface LoginSuccess {
  token: string;
  createdAt: string;
}

export const attemptLogin = async (
  dependencies: LoginDependencies,
  rawData: unknown,
  request: FastifyRequest,
): Promise<LoginSuccess | { errors: ErrorPayload[] }> => {
  if (!isPlainObject(rawData)) {
    return { errors: [{ ...USER_ERRORS.loginDataMissing }] };
  }
  const errors = gatherLoginErrors(rawData);
  if (errors.length > 0) {
    return { errors };
  }
  const user = await findUserByEmail(
    dependencies.database,
    stringOf(rawData.email),
  );
  const passwordMatches =
    user !== null &&
    (await compareUserPassword(stringOf(rawData.password), user));
  if (user === null || !passwordMatches) {
    return { errors: [{ ...USER_ERRORS.passwordWrong }] };
  }
  const session = await createSession(dependencies.database, {
    secret: dependencies.secret,
    userId: user._id,
    sessionAgeInSeconds: 0,
    userAgent: request.headers["user-agent"] ?? "",
    ip: request.ip,
  });
  return { token: session.token ?? "", createdAt: session.createdAt ?? "" };
};
