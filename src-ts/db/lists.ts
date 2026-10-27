// Lists + items persistence. Mirrors src/database/sverniks/{insert,
// find}.clj and src/database/items/find.clj:
//  - documents use the string essence id as Mongo _id; the stored
//    document has NO versionId field (reads rename _id → versionId and
//    exclude _id, like the Clojure aggregation pipeline);
//  - reads filter on newerVersionId: null (most recent version only);
//  - a stored list's items array is a vector of BARE ID STRINGS
//    (handle-updated-items!-and-return-ids returns ids); reads
//    dereference each id into a full item document or a nested list;
//  - runtime-only fields the stored documents lack: exported-to
//    (lists referencing this essence), has-exported-items (list) and
//    original-list {id, name} (item).
import type { Db } from "mongodb";
import {
  COLLECTIONS,
  CREATED_AT_FIELD,
  ID_FIELD,
  MONGO_ID_FIELD,
  NAME_FIELD,
  NEWER_VERSION_ID_FIELD,
  USER_ID_FIELD,
} from "../domain/fields.ts";
import { isItemId, isListId, type RawEssence } from "../domain/svernik.ts";

// create-mongo-unique-essence-filter matches on the ID FIELD (the
// permanent essence id), NOT on _id: _id is the current version-id and
// changes on every update (update-list-from-valid-data keeps :id and
// assigns a fresh :version-id, prepare-essence-as-new-mongo-document
// stores it as _id). Documents carry BOTH fields.
export const findListDocument = async (
  database: Db,
  listId: string,
): Promise<RawEssence | null> =>
  withRenamedId(
    await database
      .collection(COLLECTIONS.lists)
      .findOne<RawEssence>(
        {
          [ID_FIELD]: listId,
          [NEWER_VERSION_ID_FIELD]: null,
        } as never,
      ),
  );

export const findItemDocument = async (
  database: Db,
  itemId: string,
  userId: string,
): Promise<RawEssence | null> =>
  withRenamedId(
    await database
      .collection(COLLECTIONS.items)
      .findOne<RawEssence>(
        {
          // Items are looked up by their "id" FIELD (the essence id),
          // like the Clojure Filters/eq ID essence-id — the document's
          // _id is the current version-id, which changes on update.
          [ID_FIELD]: itemId,
          [NEWER_VERSION_ID_FIELD]: null,
          [USER_ID_FIELD]: userId,
        } as never,
      ),
  );

// aggregate-lookup-exported-to: the {id, name} of every most-recent
// list whose items array contains essenceId, excluding the list whose
// id equals excludeId (the $ne original-list-id branch; for list
// essences originalListId is missing → nothing excluded).
export const findReferencingLists = async (
  database: Db,
  essenceId: string,
  excludeId: string | null,
): Promise<RawEssence[]> => {
  const filter: RawEssence = {
    [NEWER_VERSION_ID_FIELD]: null,
    items: essenceId,
  };
  if (excludeId !== null) {
    // Clojure excludes by the essence ID field, not _id: the two are
    // equal only while lists are unversioned (ET-217 changes that).
    filter[ID_FIELD] = { $ne: excludeId };
  }
  const found = await database
    .collection(COLLECTIONS.lists)
    .find<RawEssence>(filter as never, { projection: { [ID_FIELD]: 1, name: 1 } })
    .sort({ createdAt: 1 })
    .toArray();
  return found.map((document) => ({
    id: document.id,
    name: document.name,
  }));
};

// list-has-exported-items?: own-origin item ids (originalListId equal
// to this list's id) referenced by some OTHER most-recent list.
const listHasExportedItems = async (
  database: Db,
  listId: string,
  ownOriginItemIds: string[],
): Promise<boolean> => {
  if (ownOriginItemIds.length === 0) {
    return false;
  }
  const other = await database
    .collection(COLLECTIONS.lists)
    .findOne(
      {
        // Excluded by essence id field — see findReferencingLists.
        [ID_FIELD]: { $ne: listId },
        [NEWER_VERSION_ID_FIELD]: null,
        items: { $in: ownOriginItemIds },
      } as never,
    );
  return other !== null;
};

// Enrich a raw ITEM document for the response: exportedTo + originalList.
// findExportedToLists=false mirrors the Clojure read paths built on
// aggregate-set-empty-exported-to (find-all-most-recent-lists, nested
// item reads): exportedTo collapses to null instead of a lookup.
const enrichItem = async (
  database: Db,
  item: RawEssence,
  findExportedToLists: boolean,
): Promise<RawEssence> => {
  const originalListId =
    typeof item.originalListId === "string" ? item.originalListId : null;
  const exportedTo = findExportedToLists
    ? await findReferencingLists(database, String(item.id), originalListId)
    : null;
  const enriched: RawEssence = { ...item, exportedTo };
  if (originalListId !== null) {
    const owner = await findListDocument(database, originalListId);
    if (owner !== null) {
      enriched.originalList = { id: owner.id, name: owner.name };
    }
  }
  return enriched;
};

const dereferenceItems = async (
  database: Db,
  storedItems: unknown[],
  ownerId: string,
  findExportedToLists: boolean,
): Promise<RawEssence[]> => {
  const resolved: RawEssence[] = [];
  for (const essenceId of storedItems) {
    if (isListId(essenceId)) {
      const nested = await findListDocument(database, essenceId);
      if (nested !== null) {
        // Nested lists dereference with their OWN user-id (Clojure:
        // get-list-with-dereferenced-items reads (:user-id list)),
        // not the requester's; nested reads keep the REAL exported-to
        // lookups (Clojure re-enters find-svernik for them).
        resolved.push(
          await enrichList(
            database,
            nested,
            String(nested.userId),
            true,
          ),
        );
      }
    } else if (isItemId(essenceId)) {
      const item = await findItemDocument(database, essenceId, ownerId);
      if (item !== null) {
        resolved.push(
          await enrichItem(database, item, findExportedToLists),
        );
      }
    }
  }
  return resolved;
};

// Enrich a LIST document: dereference items, compute exportedTo and
// has-exported-items. Mirrors find-svernik + get-sorted-svernik.
// findExportedToLists=false = the aggregate-set-empty-exported-to
// branch used by find-all-most-recent-lists: the TOP-LEVEL list keeps
// its real exportedTo, nested items get exportedTo: null.
const enrichList = async (
  database: Db,
  list: RawEssence,
  ownerId: string,
  findExportedToLists: boolean,
): Promise<RawEssence> => {
  const storedItems = Array.isArray(list.items) ? list.items : [];
  const items = await dereferenceItems(
    database,
    storedItems,
    ownerId,
    findExportedToLists,
  );
  const ownOriginItemIds = items
    .filter(
      (item) =>
        typeof item.originalListId === "string" &&
        item.originalListId === list.id &&
        typeof item.id === "string",
    )
    .map((item) => String(item.id));
  const exportedTo = await findReferencingLists(
    database,
    String(list.id),
    null,
  );
  const hasExportedItems = await listHasExportedItems(
    database,
    String(list.id),
    ownOriginItemIds,
  );
  return { ...list, items, exportedTo, hasExportedItems };
};

// Full read used by GET /lists/:id and the 201 body. The TOP-LEVEL
// lookup is user-scoped (create-mongo-unique-essence-filter with
// user-id in Clojure: a foreign list is simply not found → 404).
export const findSvernik = async (
  database: Db,
  listId: string,
  userId: string,
): Promise<RawEssence | null> => {
  const document = await database
    .collection(COLLECTIONS.lists)
    .findOne<RawEssence>(
      {
        [ID_FIELD]: listId,
        [NEWER_VERSION_ID_FIELD]: null,
        [USER_ID_FIELD]: userId,
      } as never,
    );
  if (document === null) {
    return null;
  }
  return enrichList(
    database,
    withRenamedId(document) as RawEssence,
    userId,
    true,
  );
};

// prefetch-updated-items: item-id → current item document (nil when
// absent) for every item-id reference in the incoming items array.
export interface PrefetchedItems {
  [itemId: string]: RawEssence | null;
}

export const prefetchItems = async (
  database: Db,
  rawDataItems: unknown[],
  userId: string,
): Promise<PrefetchedItems> => {
  const prefetched: PrefetchedItems = {};
  for (const entry of rawDataItems) {
    const id =
      typeof entry === "object" && entry !== null && !Array.isArray(entry)
        ? (entry as RawEssence).id
        : undefined;
    if (typeof id === "string" && isItemId(id) && !(id in prefetched)) {
      prefetched[id] = await findItemDocument(database, id, userId);
    }
  }
  return prefetched;
};

// insert-svernik!-return-svernik: :new items are inserted into the
// items collection; :updated items are persisted as new versions (the
// previous version document gets newerVersionId set); the stored
// list's items array holds BARE ID STRINGS.
export const insertList = async (
  database: Db,
  svernik: RawEssence,
): Promise<void> => {
  const items = svernik.items;
  const storedItems: string[] = [];
  if (Array.isArray(items)) {
    for (const item of items as RawEssence[]) {
      if (item.state === "new") {
        await database
          .collection(COLLECTIONS.items)
          .insertOne(essenceToDocument(item));
      } else if (item.state === "updated") {
        await database
          .collection(COLLECTIONS.items)
          .updateOne(
            // create-mongo-unique-essence-filter: id + newest version —
            // without newerVersionId:null this matches ALL versions and
            // corrupts the version chain on 3+ chained updates.
            {
              [ID_FIELD]: item.id,
              [NEWER_VERSION_ID_FIELD]: null,
            } as never,
            { $set: { [NEWER_VERSION_ID_FIELD]: item.versionId } } as never,
          );
        await database
          .collection(COLLECTIONS.items)
          .insertOne(essenceToDocument(item));
      }
      storedItems.push(String(item.id));
    }
  }
  const document = essenceToDocument({ ...svernik, items: storedItems });
  await database.collection(COLLECTIONS.lists).insertOne(document);
};

// prepare-essence-as-new-mongo-document (database/sverniks/insert.clj,
// inside insert-svernik!-return-svernik): _id = version-id value; strip
// :state, :version-id, :exported-to, :imported-to, :original-list and
// the wire-computed has-exported-items (read path recomputes it;
// Clojure never persists it). insertList stores the :new items with the
// same projection.
export const essenceToDocument = (essence: RawEssence): RawEssence => {
  const {
    state: _state,
    versionId: _versionId,
    exportedTo: _exportedTo,
    importedTo: _importedTo,
    originalList: _originalList,
    hasExportedItems: _hasExportedItems,
    ...rest
  } = essence;
  return { [MONGO_ID_FIELD]: essence.versionId, ...rest };
};

// ===== Reads added by ET-216 (mirrors database/sverniks/find.clj + count.clj) =====

// Read projection equivalent: rename _id → versionId, drop _id.
export const withRenamedId = (document: RawEssence | null): RawEssence | null => {
  if (document === null) {
    return null;
  }
  const { _id, ...rest } = document;
  return { ...rest, versionId: _id };
};

// find-all-most-recent-lists: match among the most recent versions for
// the user; find-essences receives NO :sort-essences stage → natural
// MongoDB order. Each hit is enriched exactly like find-svernik minus
// the top-level user scoping (dereference with the list's OWN user-id,
// like get-list-with-dereferenced-items).
export const findAllMostRecentLists = async (
  database: Db,
  userId: string,
): Promise<RawEssence[]> => {
  const documents = await database
    .collection(COLLECTIONS.lists)
    .find<RawEssence>({
      [NEWER_VERSION_ID_FIELD]: null,
      [USER_ID_FIELD]: userId,
    } as never)
    .toArray();
  const lists: RawEssence[] = [];
  for (const document of documents) {
    lists.push(
      await enrichList(
        database,
        withRenamedId(document) as RawEssence,
        String(document[USER_ID_FIELD]),
        // find-all-most-recent-lists dereferences nested items with
        // aggregate-set-empty-exported-to: items carry exportedTo:
        // null (only the top-level exportedTo lookup stays real).
        false,
      ),
    );
  }
  return lists;
};

// count-most-recent-lists: countDocuments with the same filter.
export const countMostRecentLists = async (
  database: Db,
  userId: string,
): Promise<number> =>
  database.collection(COLLECTIONS.lists).countDocuments({
    [NEWER_VERSION_ID_FIELD]: null,
    [USER_ID_FIELD]: userId,
  } as never);

// ===== Search (ET-209; mirrors database/sverniks/find.clj search-lists) =====

// Pattern/quote query: escape the regex metacharacters so the literal
// substring match cannot be widened by user input.
const quoteRegex = (query: string): string =>
  query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// search-lists (find.clj :121-137): $or [$text search, name regex
// "i"], both wrapped by filter-among-most-recent-versions together
// with the user-id filter; sort by textScore meta first, then
// createdAt DESC; project {id, name} ONLY; convert-mongo-documents-
// to-lists with identity → plain {id, name} documents.
export const searchLists = async (
  database: Db,
  query: string,
  userId: string,
): Promise<Array<{ id: string; name: string }>> => {
  const orFilter = {
    $or: [
      { $text: { $search: query } },
      { [NAME_FIELD]: { $options: "i", $regex: quoteRegex(query) } },
    ],
  };
  const documents = await database
    .collection(COLLECTIONS.lists)
    .find<{ id: unknown; name: unknown }>(
      {
        [NEWER_VERSION_ID_FIELD]: null,
        [USER_ID_FIELD]: userId,
        ...orFilter,
      } as never,
      {
        projection: { [ID_FIELD]: 1, [NAME_FIELD]: 1, _id: 0 },
      },
    )
    .sort({ score: { $meta: "textScore" }, [CREATED_AT_FIELD]: -1 })
    .toArray();
  // identity conversion: the documents are already {id, name}.
  return documents.map((document) => ({
    id: String(document.id),
    name: String(document.name),
  }));
};

// ===== Version chain + deletion (mirrors database/sverniks/{update,delete}.clj) =====

// update-list!-return-list step 1: the previous most-recent version
// gets newerVersionId = the new version-id.
export const markUpdated = async (
  database: Db,
  listId: string,
  newVersionId: string,
): Promise<void> => {
  await database.collection(COLLECTIONS.lists).updateOne(
    {
      [ID_FIELD]: listId,
      [NEWER_VERSION_ID_FIELD]: null,
    } as never,
    { $set: { [NEWER_VERSION_ID_FIELD]: newVersionId } } as never,
  );
};

// insert-svernik!-return-svernik: persist the new version (with the
// bare-id items array) and re-read it through the full enrichment.
export const insertNewVersion = async (
  database: Db,
  svernik: RawEssence,
): Promise<RawEssence> => {
  await insertList(database, svernik);
  const stored = await findSvernik(
    database,
    String(svernik[ID_FIELD]),
    String(svernik[USER_ID_FIELD]),
  );
  return stored ?? svernik;
};

// delete-list!-return-info: remove EVERY version of the list (all
// documents with the essence id field value; the document's `id` field
// is the permanent essence id, _id is the per-version version-id).
export const deleteAllVersions = async (
  database: Db,
  listId: string,
): Promise<void> => {
  await database
    .collection(COLLECTIONS.lists)
    .deleteMany({ [ID_FIELD]: listId } as never);
};
