// List-deletion machinery for DELETE /lists/:listId (ET-218). Mirrors
// src/svernik/sverniks/delete.clj (delete-list-from-raw-data +
// delete-list!-return-result and the four process-* cascade variants),
// src/svernik/errors/svernik/deletion_errors_gatherer.clj
// (gather-list-deletion-errors + check-insertion-overflow) and
// src/svernik/errors/svernik.id-errors-gatherer.clj.
import type { Db } from "mongodb";
import {
  COLLECTIONS,
  CONTENT_FIELD,
  CREATED_AT_FIELD,
  DELETION_METHOD_FIELD,
  EXPORTED_TO_FIELD,
  ID_FIELD,
  ITEMS_FIELD,
  MONGO_ID_FIELD,
  NEWER_VERSION_ID_FIELD,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD,
  NOTE_FIELD,
  OLDER_VERSION_ID_FIELD,
  ORIGINAL_LIST_ID_FIELD,
  PURPOSE_FIELD,
  REASON_FOR_LATEST_UPDATE_FIELD,
  URL_FIELD,
  USER_ID_FIELD,
  VERSION_ID_FIELD,
} from "./fields.ts";
import {
  isItemId,
  isListId,
  ITEMS_MAX_LENGTH,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_DEFAULT,
  REASON_FOR_LATEST_UPDATE_DEFAULT,
  type RawEssence,
} from "./svernik.ts";
import { generateUniqueEssenceId } from "./essences.ts";
import { linkEssenceOrCreateItem } from "./svernik-build.ts";
import { emptyAsString, formatTemplate, missing } from "../errors/gather.ts";
import { LIST_ERRORS } from "../errors/svernik-errors.ts";
import type { EssenceError } from "../errors/svernik-errors.ts";
import {
  deleteAllVersions,
  essenceToDocument,
  findItemDocument,
  findListDocument,
  findSvernik,
  insertList,
  markUpdated,
} from "../db/lists.ts";

// deletion-method-allowed-values (svernik/domain/deletion_result.clj).
const DELETION_METHOD_ALLOWED_VALUES = ["deletion", "insertion"];
const DELETION_METHOD_DELETION = "deletion";
const DELETION_METHOD_INSERTION = "insertion";

// list-deletion-keywords (svernik/domain/svernik.clj:36) — the DELETE
// body projection; the wire name is the camelCase DELETION_METHOD_FIELD
// (utilities/keywords_fields_correspondence.clj deletion-keys).
export const LIST_DELETION_BODY_FIELDS = [DELETION_METHOD_FIELD] as const;

// item-user-provided-keywords (svernik/domain/item.clj:29) — the only
// fields a copied item keeps (select-keys semantics).
const ITEM_USER_PROVIDED_FIELDS = [
  CONTENT_FIELD,
  PURPOSE_FIELD,
  REASON_FOR_LATEST_UPDATE_FIELD,
  NOTE_FIELD,
] as const;

// EssenceErrorWithAffectedEssences (errors/utilities/error.clj:9) — the
// overflow error carries the {id, name} of every overflowing list.
export interface EssenceErrorWithAffectedEssences extends EssenceError {
  affectedEssences: Array<{ id: string; name: string }>;
}

// DeletionResult spec (svernik/domain/deletion_result.clj:24-31):
// {id, text, affected-lists} — wire keys via deletion-keys
// correspondence.
export interface DeletionResultPayload {
  [ID_FIELD]: string;
  text: string;
  [key: string]: unknown;
}

export type DeletionOutcome =
  | { readonly errors: EssenceError[] }
  | { readonly deletionResult: DeletionResultPayload };

const asArray = (value: unknown): RawEssence[] =>
  Array.isArray(value) ? (value as RawEssence[]) : [];

// not-empty? (svernik/sverniks/utilities/not_empty.clj).
const notEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (Array.isArray(value) || typeof value === "string") {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return Boolean(value);
};

// ===== Queries (svernik/sverniks/read.clj :14-22) =====

// get-lists-containing-sublist → find-lists-with-sublist
// (database/sverniks/find.clj:77-88): the MOST RECENT lists whose items
// array CONTAINS the sublist id — no $ne exclusion. Clojure dereferences
// via get-list-with-dereferenced-items false; the cascade resolves the
// items itself, so the raw most-recent documents are enough here.
const getListsContainingSublist = async (
  database: Db,
  sublistId: string,
): Promise<RawEssence[]> =>
  database
    .collection(COLLECTIONS.lists)
    .find<RawEssence>({
      [NEWER_VERSION_ID_FIELD]: null,
      items: sublistId,
    } as never)
    .toArray();

// find-lists-with-items-from-original-list (find.clj:90-107): most
// recent lists whose items contain ANY of the ids ($in), EXCLUDING the
// original list itself (Filters/ne ID — find.clj:104).
const getListsImportingItems = async (
  database: Db,
  originalListId: string,
  itemIds: string[],
): Promise<RawEssence[]> => {
  if (itemIds.length === 0) {
    return [];
  }
  return database
    .collection(COLLECTIONS.lists)
    .find<RawEssence>({
      [NEWER_VERSION_ID_FIELD]: null,
      items: { $in: itemIds },
      [ID_FIELD]: { $ne: originalListId },
    } as never)
    .toArray();
};

// get-lists-importing-items-from-list (read.clj:18-22):
// find-items-by-original-list-id (database/items/find.clj:37-44) — own
// items (originalListId == listId, same user, most recent) — then the
// lists referencing any of them.
const getListsImportingItemsFromList = async (
  database: Db,
  listId: string,
  userId: string,
): Promise<RawEssence[]> => {
  const items = await database
    .collection(COLLECTIONS.items)
    .find<RawEssence>({
      [ORIGINAL_LIST_ID_FIELD]: listId,
      [NEWER_VERSION_ID_FIELD]: null,
      [USER_ID_FIELD]: userId,
    } as never)
    .toArray();
  return getListsImportingItems(
    database,
    listId,
    items.map((item) => String(item[ID_FIELD])),
  );
};

// get-list-with-dereferenced-items false over the RAW list documents
// (getListsContainingSublist / getListsImportingItems): the stored
// items are bare id strings — a list id resolves to its full document
// (its :type drives the insertion cascade), an item id to its document.
// (delete.clj consumes the dereferenced :items of the affected lists;
// findSvernik results are already dereferenced and must NOT pass
// through here again.)
const resolveItems = async (
  database: Db,
  listDocument: RawEssence,
): Promise<RawEssence[]> => {
  const storedItems = asArray(listDocument[ITEMS_FIELD]);
  const ownerId = String(listDocument[USER_ID_FIELD]);
  const resolved: RawEssence[] = [];
  for (const essenceId of storedItems) {
    if (typeof essenceId !== "string") {
      // Already dereferenced input (an {id…} document) — keep it.
      if (typeof essenceId === "object" && essenceId !== null) {
        resolved.push(essenceId as RawEssence);
      }
      continue;
    }
    if (isListId(essenceId)) {
      const nested = await findListDocument(database, essenceId);
      if (nested !== null) {
        resolved.push(nested);
      }
    } else if (isItemId(essenceId)) {
      const item = await findItemDocument(database, essenceId, ownerId);
      if (item !== null) {
        resolved.push(item);
      }
    }
  }
  return resolved;
};

// ===== Gatherer (svernik/errors/svernik/deletion_errors_gatherer.clj) =====

// deletion-method-missing? (:13-15): the KEY is absent
// (errors utilities.clj missing? = complement of contains?).
const deletionMethodMissing = (listDeletionData: RawEssence): boolean =>
  missing(listDeletionData, DELETION_METHOD_FIELD);

// deletion-method-empty? (:17-19): empty-as-string? (nil/"" → true).
const deletionMethodEmpty = (listDeletionData: RawEssence): boolean =>
  emptyAsString(listDeletionData, DELETION_METHOD_FIELD);

// deletion-method-incorrect? (:22-26): value outside the allowed set.
const deletionMethodIncorrect = (listDeletionData: RawEssence): boolean =>
  !DELETION_METHOD_ALLOWED_VALUES.some(
    (allowed) => allowed === listDeletionData[DELETION_METHOD_FIELD],
  );

// gather-field-errors (:86-103): the checks run in order — the
// exported-list trio, then the exported-items trio — the FIRST firing
// predicate decides the single error.
const gatherDeletionMethodErrors = (
  listExported: boolean,
  hasExportedItems: boolean,
  listDeletionData: RawEssence,
): EssenceError[] => {
  const error =
    listExported && deletionMethodMissing(listDeletionData)
      ? LIST_ERRORS.deletionMethodMissingForExportedList
      : listExported && deletionMethodEmpty(listDeletionData)
        ? LIST_ERRORS.deletionMethodEmptyForExportedList
        : listExported && deletionMethodIncorrect(listDeletionData)
          ? LIST_ERRORS.deletionMethodIncorrect
          : hasExportedItems && deletionMethodMissing(listDeletionData)
            ? LIST_ERRORS.deletionMethodMissingForListWithExportedItems
            : hasExportedItems && deletionMethodEmpty(listDeletionData)
              ? LIST_ERRORS.deletionMethodEmptyForListWithExportedItems
              : hasExportedItems && deletionMethodIncorrect(listDeletionData)
                ? LIST_ERRORS.deletionMethodIncorrectForListWithExportedItems
                : null;
  return error === null ? [] : [{ ...error }];
};

// count-list-occurrences-in-items (:43-45). Affected lists may arrive
// as RAW documents (items = bare id strings) or already dereferenced
// ({id} objects) — count BOTH shapes.
const countListOccurrences = (
  listId: string,
  items: RawEssence[],
): number =>
  items.filter(
    (item) =>
      (typeof item === "string"
        ? item
        : String(item[ID_FIELD] ?? "")) === listId,
  ).length;

// would-insertion-overflow? (:47-59): (items count − occurrences) +
// (occurrences × deleted list items count) > items-max-length.
const wouldInsertionOverflow = (
  listForDeletion: RawEssence,
  importingList: RawEssence,
): boolean => {
  const deletedItemsCount = asArray(listForDeletion[ITEMS_FIELD]).length;
  const importingItems = asArray(importingList[ITEMS_FIELD]);
  const occurrences = countListOccurrences(
    String(listForDeletion[ID_FIELD]),
    importingItems,
  );
  const finalCount =
    importingItems.length - occurrences + occurrences * deletedItemsCount;
  return finalCount > ITEMS_MAX_LENGTH;
};

// check-insertion-overflow (:65-78): runs ONLY for the insertion method
// and ONLY over importing-lists; ONE error whose affected-essences list
// every overflowing importing list {id, name}
// (specify-affected-essences-error).
const checkInsertionOverflow = (
  currentList: RawEssence,
  importingLists: RawEssence[],
  listDeletionData: RawEssence,
): EssenceError[] => {
  if (listDeletionData[DELETION_METHOD_FIELD] !== DELETION_METHOD_INSERTION) {
    return [];
  }
  const overflowingLists = importingLists.filter((list) =>
    wouldInsertionOverflow(currentList, list),
  );
  if (overflowingLists.length === 0) {
    return [];
  }
  const overflowError: EssenceErrorWithAffectedEssences = {
    id: LIST_ERRORS.deletionInsertionWouldOverflowItems.id,
    text: LIST_ERRORS.deletionInsertionWouldOverflowItems.text,
    affectedEssences: overflowingLists.map((list) => ({
      id: String(list[ID_FIELD]),
      name: String(list.name),
    })),
  };
  return [overflowError];
};

// gather-list-deletion-errors (:80-107): field errors first, then the
// overflow check, flattened.
export const gatherListDeletionErrors = (
  currentList: RawEssence,
  listDeletionData: RawEssence,
  importingLists: RawEssence[],
  listsImportingItems: RawEssence[],
): EssenceError[] => [
  ...gatherDeletionMethodErrors(
    notEmpty(currentList[EXPORTED_TO_FIELD]),
    listsImportingItems.length > 0,
    listDeletionData,
  ),
  ...checkInsertionOverflow(currentList, importingLists, listDeletionData),
];

// gather-svernik-id-deletion-errors
// (svernik/errors/svernik.id-errors-gatherer.clj): contains-and-
// incorrect? on :id → list-id-incorrect demonstrating the provided id.
export const gatherSvernikIdDeletionErrors = (
  listDeletionData: RawEssence,
): EssenceError[] => {
  const id = listDeletionData[ID_FIELD];
  if (typeof id === "string" && isListId(id)) {
    return [];
  }
  return [
    {
      id: LIST_ERRORS.listIdIncorrect.id,
      text: formatTemplate(
        LIST_ERRORS.listIdIncorrect.template,
        "",
        String(id),
      ),
    },
  ];
};

// ===== Cascade (svernik/sverniks/delete.clj) =====

// select-keys item item-user-provided-keywords (:68) — nil keys stay
// present, mirroring select-keys.
const pickUserProvidedFields = (item: RawEssence): RawEssence => {
  const copy: RawEssence = {};
  for (const field of ITEM_USER_PROVIDED_FIELDS) {
    copy[field] = item[field];
  }
  return copy;
};

// process-element-for-insertion (:63-78): the deleted list's own items
// are recreated from their user-provided fields, imported items and
// lists stay {id} references.
const processElementForInsertion = (
  deletedListId: string,
  element: RawEssence,
): RawEssence => {
  if (
    isItemId(element[ID_FIELD]) &&
    element[ORIGINAL_LIST_ID_FIELD] === deletedListId
  ) {
    return pickUserProvidedFields(element);
  }
  // Imported items AND imported lists insert as references.
  if (
    (isItemId(element[ID_FIELD]) &&
      element[ORIGINAL_LIST_ID_FIELD] !== deletedListId) ||
    isListId(element[ID_FIELD])
  ) {
    return { [ID_FIELD]: element[ID_FIELD] };
  }
  throw new Error(
    "Unexpected element type when inserting the deleted list items.",
  );
};

// process-items-for-insertion + process-exported-list-elements-…
// (:103-118): the reference to the deleted list is replaced IN PLACE by
// the processed copies of its items; other elements stay untouched.
const insertExportedListElements = (
  importingListItems: RawEssence[],
  deletedListId: string,
  deletedListItems: RawEssence[],
): RawEssence[] => {
  const result: RawEssence[] = [];
  for (const element of importingListItems) {
    if (element[ID_FIELD] === deletedListId) {
      result.push(
        ...deletedListItems.map((item) =>
          processElementForInsertion(deletedListId, item),
        ),
      );
    } else {
      result.push(element);
    }
  }
  return result;
};

// process-exported-items-for-list-deletion-via-insertion
// (delete.clj :40-51 + :89-94): a MAP over the elements — an item
// originating from the deleted list (original-list-id == the deleted
// id) is replaced IN PLACE by the user-provided copy of itself
// (process-element-for-insertion: content-only, NO id); every other
// element stays as-is.
const copyExportedItemsInPlace = (
  importingListItems: RawEssence[],
  deletedListId: string,
): RawEssence[] =>
  importingListItems.map((element) =>
    isItemId(element[ID_FIELD]) &&
    element[ORIGINAL_LIST_ID_FIELD] === deletedListId
      ? pickUserProvidedFields(element)
      : element,
  );

// process-exported-items-of-list-for-deletion
// (delete.clj :40-44): the DELETION-method second pass — items
// originating from the deleted list (original-list-id == the deleted
// id) are REMOVED; everything else stays.
const removeDeletedListItems = (
  importingListItems: RawEssence[],
  deletedListId: string,
): RawEssence[] =>
  importingListItems.filter(
    (element) =>
      !(
        isItemId(element[ID_FIELD]) &&
        element[ORIGINAL_LIST_ID_FIELD] === deletedListId
      ),
  );

// process-items-for-deletion (:29-32): the reference to the deleted
// list is removed, everything else is kept as-is.
const removeListReferences = (
  importingListItems: RawEssence[],
  deletedListId: string,
): RawEssence[] =>
  importingListItems.filter(
    (element) => element[ID_FIELD] !== deletedListId,
  );

// link-essence-or-create-item-from-valid-data over the updated items:
// bare references stay {id}; id-less copies become NEW standalone items
// owned by the importing list.
const relinkItems = (
  affectedList: RawEssence,
  updatedItems: RawEssence[],
): RawEssence[] => {
  const listIdOfImporting = String(affectedList[ID_FIELD]);
  const listUrl = affectedList[URL_FIELD];
  const itemOrigin =
    typeof listUrl === "string" ? listUrl.replace(/\/lists\/.*$/, "") : "";
  return updatedItems.map((item) =>
    linkEssenceOrCreateItem(
      item,
      listIdOfImporting,
      itemOrigin,
      String(affectedList[USER_ID_FIELD]),
    ),
  );
};

// DeletionResult message (delete.clj :152-162): the suffixes accumulate
// INDEPENDENTLY for is-exported and has-exported-items.
const buildDeletionResultMessage = (
  listId: string,
  isExported: boolean,
  hasExportedItems: boolean,
  deletionMethod: unknown,
): string => {
  let message = `List with id ${listId} removed from the system.`;
  if (isExported && deletionMethod === DELETION_METHOD_INSERTION) {
    message += " Its elements have been inserted into the affected lists.";
  }
  if (isExported && deletionMethod === DELETION_METHOD_DELETION) {
    message += " It is also no longer referenced in the affected lists.";
  }
  if (hasExportedItems && deletionMethod === DELETION_METHOD_DELETION) {
    message +=
      " Its items are also no longer referenced in the affected lists.";
  }
  if (hasExportedItems && deletionMethod === DELETION_METHOD_INSERTION) {
    message += " Its items have been copied to the affected lists.";
  }
  return message;
};

// delete-list-from-raw-data (:190-209): the id gate, then the 404 gate,
// then the gatherer; on success — the cascade, delete, DeletionResult.
export const deleteListFromRawData = async (
  database: Db,
  listDeletionData: RawEssence,
  userId: string,
): Promise<DeletionOutcome> => {
  const listId = String(listDeletionData[ID_FIELD]);
  // gather-list-deletion-data-errors (:127-139): step 1 — the id gate.
  const idErrors = gatherSvernikIdDeletionErrors(listDeletionData);
  if (idErrors.length > 0) {
    return { errors: idErrors };
  }
  // Step 2: get-list — a foreign or unknown list is simply not found.
  const current = await findSvernik(database, listId, userId);
  if (current === null) {
    return {
      errors: [
        {
          id: LIST_ERRORS.listNotFound.id,
          text: formatTemplate(LIST_ERRORS.listNotFound.text, "", listId),
        },
      ],
    };
  }
  const isExported = notEmpty(current[EXPORTED_TO_FIELD]);
  // importing-lists are computed ONLY when the list is exported
  // (:196-197); lists-importing-items — whenever the list exists.
  const importingLists = isExported
    ? await getListsContainingSublist(database, listId)
    : [];
  const listsImportingItems = await getListsImportingItemsFromList(
    database,
    listId,
    userId,
  );
  // Step 3: gather-list-deletion-errors.
  const errors = gatherListDeletionErrors(
    current,
    listDeletionData,
    importingLists,
    listsImportingItems,
  );
  if (errors.length > 0) {
    return { errors };
  }
  // all-affected-lists-set (:149-151): the importing lists dedup by id,
  // containment set + items-importing set.
  const affectedById = new Map<string, RawEssence>();
  for (const list of [...importingLists, ...listsImportingItems]) {
    affectedById.set(String(list[ID_FIELD]), list);
  }
  const affectedLists = [...affectedById.values()];
  const deletionMethod = listDeletionData[DELETION_METHOD_FIELD];
  const hasExportedItems = listsImportingItems.length > 0;
  const affectedListIds: string[] = [];
  if (
    deletionMethod === DELETION_METHOD_DELETION ||
    deletionMethod === DELETION_METHOD_INSERTION
  ) {
    // The cascade works on the DEREFERENCED items of the deleted list
    // (:items after read — delete.clj :107-109). current comes from
    // findSvernik, whose items are ALREADY dereferenced.
    const deletedListItems = asArray(current[ITEMS_FIELD]);
    for (const affectedList of affectedLists) {
      const items = await resolveItems(database, affectedList);
      const updatedItems =
        deletionMethod === DELETION_METHOD_DELETION
          ? // delete-exported-list-and-its-references-in-importing-lists!
            // (process-items-for-deletion = remove the list reference)
            // then delete-list-and-its-exported-items-from-importing-
            // lists! (process-exported-items-of-list-for-deletion =
            // remove the items originating from the deleted list).
            removeDeletedListItems(removeListReferences(items, listId), listId)
          : // delete-exported-list-and-insert-elements-in-importing-lists!
            // (the list reference expands into the deleted list's items)
            // then delete-list-and-insert-exported-items-in-importing-
            // lists! (own-origin items become in-place content copies).
            copyExportedItemsInPlace(
              insertExportedListElements(items, listId, deletedListItems),
              listId,
            );
      // update-list-from-valid-data {:items …} + update-list!-return-list
      // (:177-184): a NEW version of the affected list — fresh
      // version-id, older-version-id chain, createdAt now, reason reset;
      // ALL writes go through markUpdated + insertList (essenceToDocument).
      const storedListId = String(affectedList[ID_FIELD]);
      const currentVersionId = String(
        affectedList[MONGO_ID_FIELD] ?? affectedList[VERSION_ID_FIELD],
      );
      const newVersionId = generateUniqueEssenceId("list");
      await markUpdated(database, storedListId, newVersionId);
      // prepare-essence-as-new-mongo-document applied to the RAW
      // affected document: _id = the new version-id; the state/
      // exported-to/has-exported-items/original-list runtime fields are
      // stripped BEFORE the merge (clojure assoc overwrites :version-id
      // and :created-at; :exported-to/:has-exported-items/:original-list
      // are read-time computed and never persisted).
      const {
        [MONGO_ID_FIELD]: _mongoId,
        [VERSION_ID_FIELD]: _versionId,
        [EXPORTED_TO_FIELD]: _exportedTo,
        hasExportedItems: _hasExportedItems,
        originalList: _originalList,
        ...restOfAffected
      } = affectedList;
      await insertList(database, {
        [MONGO_ID_FIELD]: newVersionId,
        ...restOfAffected,
        [VERSION_ID_FIELD]: newVersionId,
        [OLDER_VERSION_ID_FIELD]: currentVersionId,
        [NEWER_VERSION_ID_FIELD]: null,
        [CREATED_AT_FIELD]: new Date().toISOString(),
        [REASON_FOR_LATEST_UPDATE_FIELD]: REASON_FOR_LATEST_UPDATE_DEFAULT,
        [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD]:
          NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_DEFAULT,
        [ITEMS_FIELD]: relinkItems(affectedList, updatedItems),
      });
      affectedListIds.push(storedListId);
    }
  }
  // delete-list!-return-info: EVERY version of the list is removed.
  await deleteAllVersions(database, listId);
  return {
    deletionResult: {
      [ID_FIELD]: listId,
      text: buildDeletionResultMessage(
        listId,
        isExported,
        hasExportedItems,
        deletionMethod,
      ),
      affectedLists: affectedListIds,
    },
  };
};
