// Svernik creation from validated raw data. Mirrors
// src/svernik/sverniks/create.clj (create-svernik-from-valid-data),
// merge_items_data.clj + link_essence_or_create_item_from_valid_data.clj
// (item merge) and get_sorted_* (key ordering is applied at
// serialization time by sendEssenceJSON, so buildSvernik just carries
// the right keys).
import type { Db } from "mongodb";
import {
  generateUniqueEssenceId,
} from "./essences.ts";
import { type PrefetchedItems, findItemDocument } from "../db/lists.ts";
import { hasItemUserPayload } from "../errors/svernik-items.ts";
import {
  CREATED_AT_FIELD,
  HAS_EXPORTED_ITEMS_FIELD,
  ITEMS_FIELD,
  NEWER_VERSION_ID_FIELD,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD,
  NOTE_FIELD,
  OLDER_VERSION_ID_FIELD,
  PURPOSE_FIELD,
  REASON_FOR_LATEST_UPDATE_FIELD,
  TYPE_FIELD,
  URL_FIELD,
  USER_ID_FIELD,
  VERSION_ID_FIELD,
  ID_FIELD,
  ORIGINAL_LIST_ID_FIELD,
  CONTENT_FIELD,
} from "./fields.ts";
import {
  CONTENT,
  EXPORTED_TO,
  HAS_EXPORTED_ITEMS_DEFAULT,
  isItemId,
  isListId,
  ITEMS_DEFAULT,
  LIST_TYPE,
  NOTE_DEFAULT,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_DEFAULT,
  PURPOSE_DEFAULT,
  REASON_FOR_LATEST_UPDATE_DEFAULT,
  type RawEssence,
} from "./svernik.ts";

// Canonical contentful-as-string? (svernik.errors.utilities.string-
// measurements / check-reasons.reason-contentful?): (str value) is
// non-empty. The protocol's user-provided values are strings, null or
// absent, so str(…) ≡ the value: present AND non-null AND non-empty.
// Both the create path and the PATCH route (ET-220) use THIS helper.
export const contentful = (rawData: RawEssence, field: string): boolean =>
  field in rawData &&
  rawData[field] !== null &&
  rawData[field] !== undefined &&
  !(typeof rawData[field] === "string" && rawData[field].length === 0);

// empty-as-string? twin (svernik.utilities.reason-empty): nil or "".
export const emptyAsStringValue = (value: unknown): boolean =>
  value === null || value === "";

// create-item-from-valid-data (link-essence-or-create-item...clj):
// fresh item document with its own id, original-list-id of the new
// list, defaults for purpose/note/reason.
export const createItemFromValidData = (
  itemData: RawEssence,
  listId: string,
  serverUrl: string,
  userId: string,
): RawEssence => {
  const id = generateUniqueEssenceId("item");
  return {
    [ID_FIELD]: id,
    [VERSION_ID_FIELD]: id,
    [OLDER_VERSION_ID_FIELD]: null,
    [NEWER_VERSION_ID_FIELD]: null,
    [ORIGINAL_LIST_ID_FIELD]: listId,
    [TYPE_FIELD]: "item",
    state: "new",
    [CREATED_AT_FIELD]: new Date().toISOString(),
    [URL_FIELD]: `${serverUrl}/items/${id}`,
    [CONTENT_FIELD]: itemData[CONTENT],
    [PURPOSE_FIELD]: itemData[PURPOSE_FIELD] ?? PURPOSE_DEFAULT,
    [REASON_FOR_LATEST_UPDATE_FIELD]: REASON_FOR_LATEST_UPDATE_DEFAULT,
    [NOTE_FIELD]: itemData[NOTE_FIELD] ?? NOTE_DEFAULT,
    [USER_ID_FIELD]: userId,
  };
};

// link-essence-or-create-item-from-valid-data: a valid essence-id
// reference ({id: "item-..."}/{id: "list-..."}) stays a bare {id}
// reference (extra payload data is dropped); everything else becomes a
// new item. Validation has already run, so data here is trusted.
export const linkEssenceOrCreateItem = (
  itemData: RawEssence,
  listId: string,
  serverUrl: string,
  userId: string,
): RawEssence => {
  const id = itemData[ID_FIELD];
  if (typeof id === "string" && (isListId(id) || isItemId(id))) {
    // A list-id reference stays a reference; an item-id reference
    // WITHOUT payload also stays a reference (with payload it becomes
    // an :updated item — ET-216+, not exercised by creation features
    // beyond the error paths).
    return { [ID_FIELD]: id };
  }
  return createItemFromValidData(itemData, listId, serverUrl, userId);
};

// merge-item-update-data creation branch: an item-id reference WITH
// user payload updates the current item (update-item-from-valid-data):
// new version-id, older-version-id = current version, contentful
// fields applied, empty fields reset to defaults. Everything else
// (bare references, fresh content items) links/creates.
export const mergeItemsData = async (
  rawDataItems: unknown[],
  listId: string,
  serverUrl: string,
  userId: string,
  prefetched: PrefetchedItems,
  database: Db,
): Promise<RawEssence[]> => {
  const merged: RawEssence[] = [];
  for (const itemData of rawDataItems as RawEssence[]) {
    const isMap = typeof itemData === "object" && itemData !== null &&
      !Array.isArray(itemData);
    const id = isMap ? itemData[ID_FIELD] : undefined;
    const hasItemId = typeof id === "string" && isItemId(id);
    const hasPayload = isMap && hasItemId && hasItemUserPayload(itemData);
    if (isMap && hasItemId && hasPayload) {
      const current = prefetched[id as string] ??
        // Prefetch misses entries added mid-request or when the
        // incoming id was validated against a concurrently created
        // item — resolve directly like find-item does.
        await findItemDocument(database, id as string, userId);
      merged.push(
        updateItemFromValidData(current, itemData as RawEssence, userId),
      );
      continue;
    }
    merged.push(
      linkEssenceOrCreateItem(itemData as RawEssence, listId, serverUrl, userId),
    );
  }
  return merged;
};

// update-item-from-valid-data (svernik.items.update): carried fields
// from the CURRENT item; contentful content/purpose/note/reason are
// applied; empty ones reset to the defaults. reason-for-latest-update
// ("" when reset) is the empty variant, no-documented-reason = true.
export const updateItemFromValidData = (
  currentItem: RawEssence | null,
  updateData: RawEssence,
  userId: string,
): RawEssence => {
  const newVersionId = generateUniqueEssenceId("item");
  // contentful-as-string? in Clojure: the value is a non-empty STRING
  // (null/""/non-strings are not contentful — String(null) would
  // wrongly yield "null").
  const contentful = (field: string): boolean =>
    typeof updateData[field] === "string" && updateData[field] !== "";
  const item: RawEssence = {
    ...currentItem,
    [ID_FIELD]: currentItem?.[ID_FIELD] ?? newVersionId,
    [VERSION_ID_FIELD]: newVersionId,
    [OLDER_VERSION_ID_FIELD]: currentItem?.[VERSION_ID_FIELD] ?? null,
    [NEWER_VERSION_ID_FIELD]: null,
    state: "updated",
    [CREATED_AT_FIELD]: new Date().toISOString(),
    [USER_ID_FIELD]: currentItem?.[USER_ID_FIELD] ?? userId,
  };
  // content (no default — the required field; validation guarantees
  // contentful here when present)
  if (contentful(CONTENT_FIELD)) {
    item[CONTENT_FIELD] = updateData[CONTENT_FIELD];
  }
  // purpose: contentful → value; empty-as-string (nil/"") → default
  if (contentful(PURPOSE_FIELD)) {
    item[PURPOSE_FIELD] = updateData[PURPOSE_FIELD];
  } else if (
    PURPOSE_FIELD in updateData &&
    (updateData[PURPOSE_FIELD] === null || updateData[PURPOSE_FIELD] === "")
  ) {
    item[PURPOSE_FIELD] = PURPOSE_DEFAULT;
  }
  // note: contentful → value; empty-as-string (nil/"") → default
  if (contentful(NOTE_FIELD)) {
    item[NOTE_FIELD] = updateData[NOTE_FIELD];
  } else if (
    NOTE_FIELD in updateData &&
    (updateData[NOTE_FIELD] === null || updateData[NOTE_FIELD] === "")
  ) {
    item[NOTE_FIELD] = NOTE_DEFAULT;
  }
  // reason-for-latest-update: contentful → value; else default ""
  // UNCONDITIONALLY (Clojure reason-empty? = (not contentful-as-string?)
  // — an ABSENT key is also "empty", unlike purpose/note).
  if (contentful(REASON_FOR_LATEST_UPDATE_FIELD)) {
    item[REASON_FOR_LATEST_UPDATE_FIELD] =
      updateData[REASON_FOR_LATEST_UPDATE_FIELD];
  } else {
    item[REASON_FOR_LATEST_UPDATE_FIELD] =
      REASON_FOR_LATEST_UPDATE_DEFAULT;
  }
  return item;
};

// create-svernik-from-valid-data: the full unsorted list document.
export const buildSvernik = async (
  rawData: RawEssence,
  userId: string,
  serverUrl: string,
  database: Db,
  prefetched: PrefetchedItems,
): Promise<RawEssence> => {
  const id = generateUniqueEssenceId("list");
  const purposePresent = contentful(rawData, PURPOSE_FIELD);
  const notePresent = contentful(rawData, NOTE_FIELD);
  return {
    [ID_FIELD]: id,
    [VERSION_ID_FIELD]: id,
    [OLDER_VERSION_ID_FIELD]: null,
    [NEWER_VERSION_ID_FIELD]: null,
    [TYPE_FIELD]: LIST_TYPE,
    [CREATED_AT_FIELD]: new Date().toISOString(),
    [URL_FIELD]: `${serverUrl}/lists/${id}`,
    [ITEMS_FIELD]: await mergeItemsData(
      (rawData[ITEMS_FIELD] as unknown[]) ?? ITEMS_DEFAULT,
      id,
      serverUrl,
      userId,
      prefetched,
      database,
    ),
    name: rawData.name,
    [PURPOSE_FIELD]: purposePresent ? rawData[PURPOSE_FIELD] : PURPOSE_DEFAULT,
    [REASON_FOR_LATEST_UPDATE_FIELD]: REASON_FOR_LATEST_UPDATE_DEFAULT,
    [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD]:
      NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_DEFAULT,
    [NOTE_FIELD]: notePresent ? rawData[NOTE_FIELD] : NOTE_DEFAULT,
    [EXPORTED_TO]: [],
    [HAS_EXPORTED_ITEMS_FIELD]: HAS_EXPORTED_ITEMS_DEFAULT,
    [USER_ID_FIELD]: userId,
  };
};
