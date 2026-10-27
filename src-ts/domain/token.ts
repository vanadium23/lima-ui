import { createHmac, randomBytes } from "node:crypto";
import type { Db } from "mongodb";
import { SESSION_TOKEN_PREFIX, SESSION_TOKEN_RANDOM_BYTES } from "./constants.ts";
import {
  COLLECTIONS,
  CREATED_AT_FIELD,
  MONGO_ID_FIELD,
  TOKEN_FIELD,
  TOKEN_TYPE_FIELD,
  USER_ID_FIELD,
} from "./fields.ts";
import { nowISOString } from "../utilities/time.ts";

// Mirrors src/auth/domain/token.clj generate-token-value: sessions get
// the default "tok" prefix (the prefix map only knows "rgt"/"rst"),
// then "_" + unpadded base64url of 32 secure random bytes.
export const generateTokenValue = (): string =>
  `${SESSION_TOKEN_PREFIX}_${randomBytes(SESSION_TOKEN_RANDOM_BYTES)
    .toString("base64url")}`;

// src/auth/domain/token.clj token-type-prefixes — registration /
// password-reset one-time tokens carry their own prefixes (the suite
// greps rgt_/rst_ out of the emails).
export const REGISTRATION_TOKEN_TYPE = "registration";
export const PASSWORD_RESET_TOKEN_TYPE = "password-reset";

const TOKEN_TYPE_PREFIXES: Record<string, string> = {
  [REGISTRATION_TOKEN_TYPE]: "rgt",
  [PASSWORD_RESET_TOKEN_TYPE]: "rst",
};

// Unknown types fall back to the default "tok" branch, as in Clojure.
export const generateTypedTokenValue = (tokenType: string): string => {
  const prefix = TOKEN_TYPE_PREFIXES[tokenType] ?? SESSION_TOKEN_PREFIX;
  return `${prefix}_${randomBytes(SESSION_TOKEN_RANDOM_BYTES)
    .toString("base64url")}`;
};

// Token document shape (database.tokens.insert.clj: the token value IS
// the Mongo _id; the remaining fields carry the keywords-fields
// correspondence camelCase names).
export interface TokenDocument {
  [MONGO_ID_FIELD]: string;
  [TOKEN_TYPE_FIELD]: string;
  [USER_ID_FIELD]: string;
  [CREATED_AT_FIELD]: string;
}

export interface StoredToken {
  token: string;
  type: string;
  userId: string;
}

// auth.tokens.create/create-token: generate → insert → return value.
export const createToken = async (
  database: Db,
  tokenType: string,
  userId: string,
): Promise<string> => {
  const tokenValue = generateTypedTokenValue(tokenType);
  const tokenData: TokenDocument = {
    [MONGO_ID_FIELD]: tokenValue,
    [TOKEN_TYPE_FIELD]: tokenType,
    [USER_ID_FIELD]: userId,
    [CREATED_AT_FIELD]: nowISOString(),
  };
  await database.collection(COLLECTIONS.tokens).insertOne(tokenData as never);
  return tokenValue;
};

const toStoredToken = (document: TokenDocument): StoredToken => ({
  token: document[MONGO_ID_FIELD],
  type: document[TOKEN_TYPE_FIELD] ?? "",
  userId: document[USER_ID_FIELD] ?? "",
});

// database.tokens.find/find-and-delete-token!: findOneAndDelete by the
// token value (_id) — single use is guaranteed by the atomic delete.
export const findAndDeleteToken = async (
  database: Db,
  tokenValue: string,
): Promise<StoredToken | null> => {
  const document = await database
    .collection(COLLECTIONS.tokens)
    .findOneAndDelete({ [MONGO_ID_FIELD]: tokenValue } as never);
  return document === null
    ? null
    : toStoredToken(document as unknown as TokenDocument);
};

// database.tokens.find/find-token: existence check for the gatherer.
export const findToken = async (
  database: Db,
  tokenValue: string,
): Promise<StoredToken | null> => {
  const document = await database
    .collection(COLLECTIONS.tokens)
    .findOne<TokenDocument>({ [MONGO_ID_FIELD]: tokenValue } as never);
  return document === null ? null : toStoredToken(document);
};

// Mirrors src/auth/utilities/session_crypto.clj: HMAC-SHA256 of the raw
// token, hex-encoded, with SESSION_HMAC_SECRET as the utf8 key.
export const hashSessionToken = (
  rawToken: string,
  secret: string,
): string => createHmac("sha256", secret).update(rawToken).digest("hex");

// Re-exported for sessions.ts, which re-exports generateToken today.
export { TOKEN_FIELD };
