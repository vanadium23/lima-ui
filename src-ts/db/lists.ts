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
  ITEMS_FIELD,
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

// ===== Read enrichment (find-svernik / get-list-with-dereferenced-items) =====
//
// A list read resolves references, not values: every stored items entry
// is a bare id (an item document or a nested list), items carry
// original-list {id, name}, lists carry exported-to and
// has-exported-items. One Mongo round trip PER REFERENCE was 729
// sequential finds for GET /lists over 60 lists x 5 items. The batch
// below resolves a whole nesting level in three queries (items, lists,
// referencing lists) with the per-reference semantics of the lookups it
// replaces:
//  - find-item: the most recent version of the id, owned by the
//    referencing list's user;
//  - find-essence (nested list, original list): the most recent version
//    of the id, any user;
//  - aggregate-lookup-exported-to: the most recent lists whose items
//    contain the essence id, minus the original list, in createdAt order.

// A list referencing itself (directly or through nested lists) recursed
// without end — a stack overflow, i.e. a 500. Same failure here, without
// hanging the event loop.
const MAX_NESTING_DEPTH = 64;

interface ListEntry {
  document: RawEssence;
  ownerId: string;
  depth: number;
}

// One place of a list's items array: a resolved item (enriched once the
// level's referencing lists are read) or a nested list (its placeholder
// is filled in place after the next level is read, so the array keeps
// the reference order).
type ItemPlace = { item: RawEssence } | { slot: RawEssence };

const storedItemsOf = (list: RawEssence): unknown[] =>
  Array.isArray(list.items) ? (list.items as unknown[]) : [];

// `items: value` on an array field: the field itself or one element.
const referencesEssence = (items: unknown, essenceId: string): boolean =>
  Array.isArray(items) ? items.includes(essenceId) : items === essenceId;

// The most recent version of every id in ONE query. The version chain
// keeps exactly one most-recent document per id; should that invariant
// ever break, the FIRST in natural order wins — what findOne answered.
const findMostRecentById = async (
  database: Db,
  collection: string,
  ids: Iterable<string>,
): Promise<Map<string, RawEssence>> => {
  const found = new Map<string, RawEssence>();
  const unique = [...new Set(ids)];
  if (unique.length === 0) {
    return found;
  }
  const documents = await database
    .collection(collection)
    .find<RawEssence>({
      [ID_FIELD]: { $in: unique },
      [NEWER_VERSION_ID_FIELD]: null,
    } as never)
    .toArray();
  for (const document of documents) {
    const id = String(document[ID_FIELD]);
    if (!found.has(id)) {
      found.set(id, document);
    }
  }
  return found;
};

// The most recent lists referencing any of the essence ids: {id, name}
// plus the items array the in-memory filter needs, in createdAt order —
// findReferencingLists for a whole set (filtering a sorted sequence per
// essence id keeps each id's order).
const findReferencingListsByIds = async (
  database: Db,
  essenceIds: Iterable<string>,
): Promise<RawEssence[]> => {
  const unique = [...new Set(essenceIds)];
  if (unique.length === 0) {
    return [];
  }
  return database
    .collection(COLLECTIONS.lists)
    .find<RawEssence>(
      {
        [NEWER_VERSION_ID_FIELD]: null,
        [ITEMS_FIELD]: { $in: unique },
      } as never,
      { projection: { [ID_FIELD]: 1, name: 1, [ITEMS_FIELD]: 1 } },
    )
    .sort({ createdAt: 1 })
    .toArray();
};

// Enrich a raw ITEM document: exportedTo + originalList. The
// findExportedToLists=false branch mirrors the Clojure read paths built
// on aggregate-set-empty-exported-to (find-all-most-recent-lists, nested
// item reads): exportedTo collapses to null instead of a lookup.
const enrichItemFromLookups = (
  item: RawEssence,
  findExportedToLists: boolean,
  listDocuments: Map<string, RawEssence>,
  referencing: RawEssence[],
): RawEssence => {
  const itemId = String(item.id);
  const originalListId =
    typeof item.originalListId === "string" ? item.originalListId : null;
  const exportedTo = findExportedToLists
    ? referencing
        .filter(
          (document) =>
            // The $ne original-list-id branch of findReferencingLists.
            (originalListId === null ||
              document[ID_FIELD] !== originalListId) &&
            referencesEssence(document[ITEMS_FIELD], itemId),
        )
        .map((document) => ({ id: document.id, name: document.name }))
    : null;
  const enriched: RawEssence = { ...item, exportedTo };
  if (originalListId !== null) {
    const owner = listDocuments.get(originalListId);
    if (owner !== undefined) {
      enriched.originalList = { id: owner.id, name: owner.name };
    }
  }
  return enriched;
};

// find-svernik + get-sorted-svernik for a batch of lists of ONE nesting
// level: dereference the items, compute exportedTo and
// has-exported-items. findExportedToLists=false is the
// aggregate-set-empty-exported-to branch of find-all-most-recent-lists:
// the top-level lists keep their real exportedTo, their items get
// exportedTo: null. Nested lists always re-enter with the real lookups.
const enrichListEntries = async (
  database: Db,
  entries: ListEntry[],
  findExportedToLists: boolean,
): Promise<RawEssence[]> => {
  if (entries.length === 0) {
    return [];
  }
  for (const entry of entries) {
    if (entry.depth > MAX_NESTING_DEPTH) {
      throw new RangeError(
        "List nesting is too deep (a list referencing itself?).",
      );
    }
  }
  const storedPerEntry = entries.map((entry) => storedItemsOf(entry.document));

  // The references of this level.
  const itemIds = new Set<string>();
  const listIds = new Set<string>();
  for (const storedItems of storedPerEntry) {
    for (const essenceId of storedItems) {
      if (isListId(essenceId)) {
        listIds.add(essenceId);
      } else if (isItemId(essenceId)) {
        itemIds.add(essenceId);
      }
    }
  }

  // find-item: the most recent version of the id, owned by the
  // referencing list's user — keyed by owner + id.
  const itemDocuments = await findMostRecentById(
    database,
    COLLECTIONS.items,
    itemIds,
  );
  const resolvedItems = new Map<string, RawEssence | null>();
  for (const entry of entries) {
    for (const essenceId of storedItemsOf(entry.document)) {
      if (!isItemId(essenceId)) {
        continue;
      }
      const key = `${entry.ownerId}\u0000${essenceId}`;
      if (resolvedItems.has(key)) {
        continue;
      }
      const document = itemDocuments.get(essenceId);
      resolvedItems.set(
        key,
        document !== undefined && document[USER_ID_FIELD] === entry.ownerId
          ? (withRenamedId(document) as RawEssence)
          : null,
      );
    }
  }

  // find-essence: the most recent version of the id, any user — the
  // nested lists and the items' original lists.
  for (const item of resolvedItems.values()) {
    if (item !== null && typeof item.originalListId === "string") {
      listIds.add(item.originalListId);
    }
  }
  const listDocuments = await findMostRecentById(
    database,
    COLLECTIONS.lists,
    listIds,
  );

  // The items arrays in reference order; the next level's entries.
  const placesPerEntry: ItemPlace[][] = [];
  const childSlots: RawEssence[] = [];
  const childEntries: ListEntry[] = [];
  for (const [index, entry] of entries.entries()) {
    const places: ItemPlace[] = [];
    for (const essenceId of storedPerEntry[index] ?? []) {
      if (isListId(essenceId)) {
        const nested = listDocuments.get(essenceId);
        if (nested !== undefined) {
          // Nested lists dereference with their OWN user-id (Clojure:
          // get-list-with-dereferenced-items reads (:user-id list)),
          // not the requester's; nested reads keep the REAL exported-to
          // lookups (Clojure re-enters find-svernik for them).
          const slot: RawEssence = {};
          places.push({ slot });
          childSlots.push(slot);
          childEntries.push({
            document: withRenamedId(nested) as RawEssence,
            ownerId: String(nested[USER_ID_FIELD]),
            depth: entry.depth + 1,
          });
        }
      } else if (isItemId(essenceId)) {
        const item = resolvedItems.get(`${entry.ownerId}\u0000${essenceId}`);
        if (item !== undefined && item !== null) {
          places.push({ item });
        }
      }
    }
    placesPerEntry.push(places);
  }

  // The next level, then the placeholders are filled in place.
  const children = await enrichListEntries(database, childEntries, true);
  for (const [index, slot] of childSlots.entries()) {
    const child = children[index];
    if (child !== undefined) {
      Object.assign(slot, child);
    }
  }

  // list-has-exported-items?: the own-origin item ids (originalListId
  // equal to this list's id) — over the final items, nested lists
  // included, like the Clojure (filter … (:items list)).
  const ownOriginIdsPerEntry = placesPerEntry.map((places, index) => {
    const listId = entries[index]?.document[ID_FIELD];
    return places
      .map((place) => ("slot" in place ? place.slot : place.item))
      .filter(
        (essence) =>
          typeof essence.originalListId === "string" &&
          essence.originalListId === listId &&
          typeof essence.id === "string",
      )
      .map((essence) => String(essence.id));
  });

  // aggregate-lookup-exported-to for every list of the level, plus the
  // items' exported-to (real lookups) or at least the own-origin ids
  // the has-exported-items check needs.
  const referencedIds = new Set<string>();
  for (const entry of entries) {
    referencedIds.add(String(entry.document[ID_FIELD]));
  }
  for (const essenceId of findExportedToLists ? itemIds : []) {
    referencedIds.add(essenceId);
  }
  if (!findExportedToLists) {
    for (const ownOriginIds of ownOriginIdsPerEntry) {
      for (const essenceId of ownOriginIds) {
        referencedIds.add(essenceId);
      }
    }
  }
  const referencing = await findReferencingListsByIds(database, referencedIds);

  return entries.map((entry, index) => {
    const items = (placesPerEntry[index] ?? []).map((place) =>
      "slot" in place
        ? place.slot
        : enrichItemFromLookups(
            place.item,
            findExportedToLists,
            listDocuments,
            referencing,
          ),
    );
    const listId = String(entry.document[ID_FIELD]);
    const ownOriginIds = new Set(ownOriginIdsPerEntry[index]);
    // aggregate-lookup-exported-to: the {id, name} of every most-recent
    // list whose items contain this list.
    const exportedTo = referencing
      .filter((document) => referencesEssence(document[ITEMS_FIELD], listId))
      .map((document) => ({ id: document.id, name: document.name }));
    // Some OTHER most-recent list references an own-origin item.
    const hasExportedItems =
      ownOriginIds.size > 0 &&
      referencing.some(
        (document) =>
          // Excluded by the essence id field — see findReferencingLists.
          document[ID_FIELD] !== entry.document[ID_FIELD] &&
          storedItemsOf(document).some(
            (essenceId) =>
              typeof essenceId === "string" && ownOriginIds.has(essenceId),
          ),
      );
    return { ...entry.document, items, exportedTo, hasExportedItems };
  });
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
  const [enriched] = await enrichListEntries(
    database,
    [{ document: withRenamedId(document) as RawEssence, ownerId: userId, depth: 0 }],
    true,
  );
  return enriched ?? null;
};

// prefetch-updated-items: item-id → current item document (nil when
// absent) for every item-id reference in the incoming items array.
export interface PrefetchedItems {
  [itemId: string]: RawEssence | null;
}

export const prefetchItems = async (
  database: Db,
  rawDataItems: unknown,
  userId: string,
): Promise<PrefetchedItems> => {
  const prefetched: PrefetchedItems = {};
  const stored = Array.isArray(rawDataItems) ? rawDataItems : [];
  const itemIds: string[] = [];
  for (const candidate of stored) {
    if (candidate === null || typeof candidate !== "object") {
      continue;
    }
    const itemId = (candidate as RawEssence).id;
    if (typeof itemId !== "string" || !isItemId(itemId)) {
      continue;
    }
    if (!(itemId in prefetched)) {
      prefetched[itemId] = null;
      itemIds.push(itemId);
    }
  }
  // One query for the whole incoming items array; find-item semantics
  // (the most recent version, owned by userId) applied per id.
  const documents = await findMostRecentById(
    database,
    COLLECTIONS.items,
    itemIds,
  );
  for (const itemId of itemIds) {
    const document = documents.get(itemId);
    if (document !== undefined && document[USER_ID_FIELD] === userId) {
      prefetched[itemId] = withRenamedId(document) as RawEssence;
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
  // The whole page is dereferenced per nesting level (one query per
  // kind), not per reference. find-all-most-recent-lists dereferences
  // nested items with aggregate-set-empty-exported-to: items carry
  // exportedTo: null (only the top-level exportedTo lookup stays real).
  return enrichListEntries(
    database,
    documents.map((document) => ({
      document: withRenamedId(document) as RawEssence,
      ownerId: String(document[USER_ID_FIELD]),
      depth: 0,
    })),
    false,
  );
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
