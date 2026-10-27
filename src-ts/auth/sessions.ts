// Session lifecycle: create (login) and verify. Mirrors
// src/auth/user_sessions/create.clj (token, HMAC pepper, created-at
// shifted back by session age, _id = session id) and
// src/auth/user_sessions/verify.clj (alive check against
// session-max-age-days from static config).
import bcrypt from "bcryptjs";
import type { Db } from "mongodb";
import { SESSION_MAX_AGE_DAYS } from "../domain/constants.ts";
import {
  COLLECTIONS,
  CREATED_AT_FIELD,
  IP_FIELD,
  MONGO_ID_FIELD,
  PASSWORD_FIELD,
  TOKEN_FIELD,
  USER_AGENT_FIELD,
  USER_ID_FIELD,
} from "../domain/fields.ts";
import { generateUniqueEssenceId } from "../domain/essences.ts";
import { generateTokenValue, hashSessionToken } from "../domain/token.ts";
import { nowMinusSecondsISOString } from "../utilities/time.ts";
import {
  findUserById,
  toAuthenticatedUser,
  type AuthenticatedUser,
  type UserDocument,
} from "../domain/user.ts";

export interface SessionDocument {
  [MONGO_ID_FIELD]: string;
  [TOKEN_FIELD]: string;
  [USER_ID_FIELD]: string;
  [CREATED_AT_FIELD]: string;
  [USER_AGENT_FIELD]: string;
  [IP_FIELD]: string;
}

export interface LoginOutcome {
  ok: boolean;
  token?: string;
  createdAt?: string;
}

// Kept close to auth.domain.token: prefix + unpadded base64url of
// cryptographically secure random bytes.
export const generateToken = generateTokenValue;

export const createSession = async (
  database: Db,
  options: {
    secret: string;
    userId: string;
    sessionAgeInSeconds: number;
    userAgent: string;
    ip: string;
  },
): Promise<LoginOutcome> => {
  const rawToken = generateToken();
  const sessionId = generateUniqueEssenceId("session");
  // login.clj passes the age back so stale sessions verify as created
  // in the past; fresh logins use 0 (now).
  const createdAt = nowMinusSecondsISOString(options.sessionAgeInSeconds);
  const session: SessionDocument = {
    [MONGO_ID_FIELD]: sessionId,
    [TOKEN_FIELD]: hashSessionToken(rawToken, options.secret),
    [USER_ID_FIELD]: options.userId,
    [CREATED_AT_FIELD]: createdAt,
    [USER_AGENT_FIELD]: options.userAgent,
    [IP_FIELD]: options.ip,
  };
  await database.collection(COLLECTIONS.sessions).insertOne(session as never);
  return { ok: true, token: rawToken, createdAt };
};

const sessionAlive = (session: SessionDocument): boolean => {
  const createdAt = Date.parse(session[CREATED_AT_FIELD]);
  if (Number.isNaN(createdAt)) {
    return false;
  }
  const maxAgeMs = SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  return createdAt > Date.now() - maxAgeMs;
};

// verify.clj: hash the raw token, look the session up by the hash, then
// require it to still be alive before resolving the user.
export const verifySession = async (
  database: Db,
  secret: string,
  rawToken: string,
): Promise<AuthenticatedUser | null> => {
  const hashed = hashSessionToken(rawToken, secret);
  const session = await database
    .collection(COLLECTIONS.sessions)
    .findOne<SessionDocument>({ [TOKEN_FIELD]: hashed } as never);
  if (session === null || !sessionAlive(session)) {
    return null;
  }
  const user = await findUserById(database, session[USER_ID_FIELD]);
  return user === null ? null : toAuthenticatedUser(user);
};

// Login semantics from auth.user-sessions.login: the password check is
// the only gate besides user existence (dev users are always verified).
export const compareUserPassword = (
  candidate: string,
  user: UserDocument,
): Promise<boolean> =>
  bcrypt.compare(candidate, user[PASSWORD_FIELD]).catch(() => false);
