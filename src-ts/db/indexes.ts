// Lists collection indexes. Mirrors
// src/database/utilities/sverniks_collection.clj mount/defstate
// lists-full-text-index: the full-text index on name (REQUIRED before
// the first $text query), the case-insensitive regex helper index on
// name and the createdAt sort index. createIndex with the same keys is
// a no-op, so this is idempotent and safe on every boot.
import type { Db } from "mongodb";
import { COLLECTIONS } from "../domain/fields.ts";

export const createListsIndexes = async (database: Db): Promise<void> => {
  const lists = database.collection(COLLECTIONS.lists);
  // Full-text search
  await lists.createIndex({ name: "text" });
  // Case-insensitive regex search
  await lists.createIndex({ name: 1 });
  // Sort by creation date
  await lists.createIndex({ createdAt: -1 });
};
