// essences as Mongo documents + unique id generation. Mirrors
// src/svernik/sverniks/utilities/generate_unique_id.clj (ids are
// "<type>-<ObjectId-hex>" strings) and
// src/database/utilities/essence_prepared_as_mongo_document.clj (the
// Clojure :version-id keyword becomes the Mongo "_id" value; the stored
// field name is "versionId" per keywords-fields correspondence).
import { ObjectId } from "mongodb";
import { COLLECTIONS } from "./fields.ts";

export type EssenceIdType = "user" | "session" | "list" | "item";

const COLLECTION_FOR_TYPE: Record<EssenceIdType, string> = {
  user: COLLECTIONS.users,
  session: COLLECTIONS.sessions,
  list: COLLECTIONS.lists,
  item: COLLECTIONS.items,
};

export const generateUniqueEssenceId = (type: EssenceIdType): string =>
  `${type}-${new ObjectId().toString()}`;
