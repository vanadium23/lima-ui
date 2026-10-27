// User reading + dev-user seeding. Mirrors env/dev/clj/server/
// dev_users.clj (same emails/passwords, idempotent insert, email always
// verified) and src/auth/users/create.clj (user document shape:
// "user"-prefixed string id, bcrypt password hash, empty name).
import bcrypt from "bcryptjs";
import type { Db } from "mongodb";
import {
  COLLECTIONS,
  CREATED_AT_FIELD,
  EMAIL_FIELD,
  EMAIL_VERIFIED_FIELD,
  ID_FIELD,
  MONGO_ID_FIELD,
  NAME_FIELD,
  PASSWORD_FIELD,
  VERSION_ID_FIELD,
} from "./fields.ts";
import { generateUniqueEssenceId } from "./essences.ts";
import { nowISOString } from "../utilities/time.ts";

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

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

export const toAuthenticatedUser = (
  document: UserDocument,
): AuthenticatedUser => ({
  id: document._id,
  email: document.email,
  name: document.name,
});

export const findUserById = async (
  database: Db,
  id: string,
): Promise<UserDocument | null> =>
  database.collection(COLLECTIONS.users).findOne<UserDocument>({
    [MONGO_ID_FIELD]: id,
  } as never);

export const findUserByEmail = async (
  database: Db,
  email: string,
): Promise<UserDocument | null> =>
  database.collection(COLLECTIONS.users).findOne<UserDocument>({
    [EMAIL_FIELD]: email,
  } as never);

const insertDevUser = async (
  database: Db,
  email: string,
  password: string,
): Promise<void> => {
  const existing = await findUserByEmail(database, email);
  if (existing !== null) {
    return;
  }
  const userId = generateUniqueEssenceId("user");
  const document: UserDocument = {
    [MONGO_ID_FIELD]: userId,
    [ID_FIELD]: userId,
    [VERSION_ID_FIELD]: userId,
    [EMAIL_FIELD]: email,
    [EMAIL_VERIFIED_FIELD]: true,
    [PASSWORD_FIELD]: await bcrypt.hash(password, 12),
    [NAME_FIELD]: "",
    [CREATED_AT_FIELD]: nowISOString(),
  };
  await database
    .collection(COLLECTIONS.users)
    .insertOne(document as never);
};

// dev_users.clj: idempotent creation — existing users are skipped, so
// reboots do not touch already-seeded accounts.
export const createDevUsers = async (database: Db): Promise<number> => {
  const devUsersData: ReadonlyArray<readonly [string, string]> = [
    ["basic@lima.ooo", "devTest1"],
    ["pro@lima.ooo", "devTest1"],
    ["testBot@lima.ooo", "devTestBot0"],
    ["user@example.com", "correctPassword1"],
    ["other@example.com", "otherPassword1"],
  ];
  for (const [email, password] of devUsersData) {
    await insertDevUser(database, email, password);
  }
  return devUsersData.length;
};
