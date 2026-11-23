// Boot-time indexes. The donor's set (src/database/utilities/
// sverniks_collection.clj mount/defstate lists-full-text-index, which
// ends with a TODO to add more) plus the lookups every read path is
// made of — without them each find/findOne by essence id is a
// COLLECTION SCAN (the id fields carried no index at all, and every
// update stores a new version document, so the collections only grow).
// createIndex with the same keys is a no-op, so this is idempotent and
// safe on every boot.
import type { Db } from "mongodb";
import {
  COLLECTIONS,
  CREATED_AT_FIELD,
  ID_FIELD,
  ITEMS_FIELD,
  NEWER_VERSION_ID_FIELD,
  ORIGINAL_LIST_ID_FIELD,
  USER_ID_FIELD,
} from "../domain/fields.ts";

// get-list / get-item lookups: {id, newerVersionId: null}.
const idWithVersionKey = {
  [ID_FIELD]: 1,
  [NEWER_VERSION_ID_FIELD]: 1,
};

export const createListsIndexes = async (database: Db): Promise<void> => {
  const lists = database.collection(COLLECTIONS.lists);
  // Full-text search
  await lists.createIndex({ name: "text" });
  // Case-insensitive regex search
  await lists.createIndex({ name: 1 });
  // Sort by creation date
  await lists.createIndex({ createdAt: -1 });
  await lists.createIndex(idWithVersionKey);
  // A user's most recent lists in creation order (GET /lists):
  // equality on userId + newerVersionId, then the createdAt sort read
  // straight from the index.
  await lists.createIndex({
    [USER_ID_FIELD]: 1,
    [NEWER_VERSION_ID_FIELD]: 1,
    [CREATED_AT_FIELD]: -1,
  });
  // Lists referencing an essence (exportedTo, the importing-list
  // cascades): the stored items are bare id strings.
  await lists.createIndex({ [ITEMS_FIELD]: 1, [NEWER_VERSION_ID_FIELD]: 1 });
};

export const createItemsIndexes = async (database: Db): Promise<void> => {
  const items = database.collection(COLLECTIONS.items);
  await items.createIndex(idWithVersionKey);
  // Items originating from a list (has-exported-items, the item-import
  // cascades): {originalListId, newerVersionId: null}.
  await items.createIndex({
    [ORIGINAL_LIST_ID_FIELD]: 1,
    [NEWER_VERSION_ID_FIELD]: 1,
  });
};
