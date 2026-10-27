// Exported-items deletion machinery for PATCH /lists/:listId. Mirrors
// src/svernik/sverniks/update.clj (find-deleted-exported-items,
// get-exported-items-deletion-method-map, update-importing-lists!,
// delete-exported-items-from-importing-lists!,
// insert-copied-exported-items-into-importing-lists!) and src/svernik/
// errors/list_exported_items_deletion_errors_gatherer.clj (the strict
// validation cascade).
import type { Db } from "mongodb";
import {
  COLLECTIONS,
  CONTENT_FIELD,
  CREATED_AT_FIELD,
  DELETION_METHOD_FIELD,
  EXPORTED_ITEMS_DELETION_METHODS_FIELD,
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
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_DEFAULT,
  REASON_FOR_LATEST_UPDATE_DEFAULT,
  type RawEssence,
} from "./svernik.ts";
import { generateUniqueEssenceId } from "./essences.ts";
import { createItemFromValidData } from "./svernik-build.ts";
import { emptyAsString, formatTemplate, missing } from "../errors/gather.ts";
import { LIST_ERRORS } from "../errors/svernik-errors.ts";
import type {
  EssenceError,
  EssenceErrorTemplate,
} from "../errors/svernik-errors.ts";
import {
  findItemDocument,
  findListDocument,
  insertList,
  markUpdated,
} from "../db/lists.ts";

// deletion-method-allowed-values (svernik/domain/deletion_result.clj).
const DELETION_METHOD_ALLOWED_VALUES = ["deletion", "insertion"];

// item-user-provided-keywords (svernik/domain/item.clj:29) — the only
// fields a copied item keeps (camelCase wire names).
const ITEM_USER_PROVIDED_FIELDS = [
  CONTENT_FIELD,
  PURPOSE_FIELD,
  REASON_FOR_LATEST_UPDATE_FIELD,
  NOTE_FIELD,
] as const;

const isMap = (value: unknown): boolean =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// ===== find-deleted-exported-items =====

// item-is-exported? (update.clj :41 = some-not-empty?; the gatherer's
// own :153-155 variant): :exported-to present, non-nil AND non-empty.
const itemIsExported = (item: RawEssence): boolean => {
  const exportedTo = item[EXPORTED_TO_FIELD];
  if (exportedTo === null || exportedTo === undefined) {
    return false;
  }
  if (Array.isArray(exportedTo)) {
    return exportedTo.length > 0;
  }
  if (typeof exportedTo === "object") {
    return Object.keys(exportedTo).length > 0;
  }
  return String(exportedTo).length > 0;
};

const itemIdOf = (item: unknown): unknown =>
  isMap(item) ? (item as RawEssence)[ID_FIELD] : undefined;

// find-deleted-exported-items (update.clj :43-53 / gatherer :161-170):
// current items with original-list-id == THIS list whose id is among
// the exported ids AND absent from the newer payload.
export const findDeletedExportedItems = (
  currentItems: unknown[],
  newerItems: unknown[],
  listId: string,
): RawEssence[] => {
  const exportedIds = new Set(
    (currentItems as RawEssence[])
      .filter(itemIsExported)
      .map((item) => item[ID_FIELD]),
  );
  const newerIds = new Set(newerItems.map(itemIdOf));
  return (currentItems as RawEssence[]).filter(
    (item) =>
      item[ORIGINAL_LIST_ID_FIELD] === listId &&
      exportedIds.has(item[ID_FIELD]) &&
      !newerIds.has(item[ID_FIELD]),
  );
};

// ===== specify-* helpers (errors/utilities/error.clj) =====

// specify-id-demonstrating-error (:21-23). The id goes into the
// SECOND formatTemplate argument — the single %s consumes it
// (precedent: svernik-update.ts gatherSvernikIdUpdateErrors).
const specifyIdDemonstratingError = (
  essenceId: string,
  template: EssenceErrorTemplate,
): EssenceError => ({
  id: template.id,
  text: formatTemplate(template.template, "", essenceId),
});

// The textual reference in the %s slot: maps serialize with SORTED
// keys (into a sorted-map → convert-essence-to-JSON).
const stringifyReference = (reference: unknown): string => {
  if (reference === null || reference === undefined) {
    return "null";
  }
  if (typeof reference === "string") {
    return JSON.stringify(reference);
  }
  if (typeof reference === "number" || typeof reference === "boolean") {
    return String(reference);
  }
  if (Array.isArray(reference)) {
    return `[${reference.map(stringifyReference).join(",")}]`;
  }
  const keys = Object.keys(reference as object).sort();
  const body = keys
    .map(
      (key) =>
        `${JSON.stringify(key)}:${stringifyReference(
          (reference as Record<string, unknown>)[key],
        )}`,
    )
    .join(",");
  return `{${body}}`;
};

// specify-item-error (:11-19).
const specifyReferenceError = (
  index: number,
  reference: unknown,
  template: EssenceErrorTemplate,
): EssenceError => ({
  id: template.id,
  text: formatTemplate(
    template.template,
    String(index),
    stringifyReference(reference),
  ),
});

// ===== Gatherer predicates =====

// exported-items-deletion-methods-missing?: the KEY is absent
// (errors utilities.clj missing? = complement of contains?).
const exportedItemsDeletionMethodsMissing = (rawData: RawEssence): boolean =>
  missing(rawData, EXPORTED_ITEMS_DELETION_METHODS_FIELD);

// exported-items-deletion-methods-empty?: nil value (:16-18).
const exportedItemsDeletionMethodsEmpty = (rawData: RawEssence): boolean =>
  rawData[EXPORTED_ITEMS_DELETION_METHODS_FIELD] === null;

// exported-items-deletion-methods-incorrect?: present, non-nil AND not
// sequential (:20-23).
const exportedItemsDeletionMethodsIncorrect = (rawData: RawEssence): boolean =>
  EXPORTED_ITEMS_DELETION_METHODS_FIELD in rawData &&
  rawData[EXPORTED_ITEMS_DELETION_METHODS_FIELD] !== null &&
  !Array.isArray(rawData[EXPORTED_ITEMS_DELETION_METHODS_FIELD]);

// exported-item-deletion-method-reference-incorrect?: not a map
// (:25-27).
const referenceIncorrect = (reference: unknown): boolean =>
  !isMap(reference);

// exported-item-deletion-method-reference-empty?: empty-as-string? on
// :id (nil/"" → true; absent → false) (:44-46).
const referenceEmpty = (reference: RawEssence): boolean =>
  emptyAsString(reference, ID_FIELD);

// reference-id-incorrect?: item-id-incorrect? — present AND not an
// item-id (gatherer :48-50 → item/id_errors_gatherer.clj, the
// ::svernik.domain.item/id spec; list-ids are NOT accepted here,
// unlike deletion-result ids).
const referenceIdIncorrect = (reference: RawEssence): boolean =>
  ID_FIELD in reference && !isItemId(reference[ID_FIELD]);

// deletion-method-missing?: the KEY is absent (:72-74).
const deletionMethodMissing = (reference: RawEssence): boolean =>
  missing(reference, DELETION_METHOD_FIELD);

// deletion-method-empty?: empty-as-string? on :deletion-method (:76-78).
const deletionMethodEmpty = (reference: RawEssence): boolean =>
  emptyAsString(reference, DELETION_METHOD_FIELD);

// deletion-method-incorrect?: value outside the allowed set (:80-83).
const deletionMethodIncorrect = (reference: RawEssence): boolean =>
  !DELETION_METHOD_ALLOWED_VALUES.some(
    (allowed) => allowed === reference[DELETION_METHOD_FIELD],
  );

// ===== Gatherer groups =====

// gather-exported-items-deletion-method-references-errors: one error
// max per reference, ALL references in order (:29-42).
const gatherReferencesErrors = (references: unknown[]): EssenceError[] => {
  const errors: EssenceError[] = [];
  references.forEach((reference, index) => {
    if (referenceIncorrect(reference)) {
      errors.push(
        specifyReferenceError(
          index,
          reference,
          LIST_ERRORS.exportedItemDeletionMethodReferenceIncorrect,
        ),
      );
    }
  });
  return errors;
};

// The ids-error texts re-specified per reference (specify-item-error
// of the gatherer; templates verbatim list_errors.clj :73-80).
const REFERENCE_ERROR_TEMPLATES: Record<string, string> = {
  [LIST_ERRORS.referenceEmpty.id]:
    "The 'id' field of the reference with index %d is empty: %s.",
  [LIST_ERRORS.referenceIncorrect.id]:
    "The 'id' field of the reference with index %d should be the properly formatted string: %s.",
};

// gather-...-references-ids-errors: per MAP reference (:52-70): id
// empty → id incorrect, first wins, ALL references in order.
const gatherReferencesIdsErrors = (references: unknown[]): EssenceError[] => {
  const errors: EssenceError[] = [];
  references.forEach((reference, index) => {
    if (referenceIncorrect(reference)) {
      return;
    }
    const staticError = referenceEmpty(reference as RawEssence)
      ? LIST_ERRORS.referenceEmpty
      : referenceIdIncorrect(reference as RawEssence)
        ? LIST_ERRORS.referenceIncorrect
        : null;
    if (staticError !== null) {
      errors.push({
        id: staticError.id,
        text: formatTemplate(
          REFERENCE_ERROR_TEMPLATES[staticError.id] as string,
          String(index),
          stringifyReference(reference),
        ),
      });
    }
  });
  return errors;
};

// gather-...-references-deletion-method-errors: per MAP reference
// (:85-112): method missing → empty → incorrect, first wins.
const gatherReferencesDeletionMethodErrors = (
  references: unknown[],
): EssenceError[] => {
  const errors: EssenceError[] = [];
  references.forEach((reference, index) => {
    if (referenceIncorrect(reference)) {
      return;
    }
    const template = deletionMethodMissing(reference as RawEssence)
      ? LIST_ERRORS.exportedItemDeletionMethodReferenceDeletionMethodMissing
      : deletionMethodEmpty(reference as RawEssence)
        ? LIST_ERRORS.exportedItemDeletionMethodReferenceDeletionMethodEmpty
        : deletionMethodIncorrect(reference as RawEssence)
          ? LIST_ERRORS.exportedItemDeletionMethodReferenceDeletionMethodIncorrect
          : null;
    if (template !== null) {
      errors.push(specifyReferenceError(index, reference, template));
    }
  });
  return errors;
};

// id → [[index, method], …] reduced over references carrying BOTH id
// and method (:117-126: `(if (and id method) ...`).
type EntriesById = Map<string, Array<[number, unknown]>>;

const buildEntriesById = (references: unknown[]): EntriesById => {
  const entriesById: EntriesById = new Map();
  (references as RawEssence[]).forEach((reference, index) => {
    const id = reference?.[ID_FIELD];
    const method = reference?.[DELETION_METHOD_FIELD];
    if (
      id !== undefined && id !== null &&
      method !== undefined && method !== null
    ) {
      entriesById.set(String(id), [
        ...(entriesById.get(String(id)) ?? []),
        [index, method],
      ]);
    }
  });
  return entriesById;
};

// gather-...-duplicated-with-different-method (:114-140): every id
// with ≥2 DISTINCT methods errors on its LAST index.
const gatherReferencesDuplicationErrors = (
  references: unknown[],
  entriesById: EntriesById,
): EssenceError[] => {
  const errors: EssenceError[] = [];
  for (const entries of entriesById.values()) {
    const distinct = new Set(entries.map(([, method]) => String(method)));
    if (distinct.size > 1) {
      const lastEntry = entries[entries.length - 1] as [number, unknown];
      const lastIndex = lastEntry[0];
      errors.push(
        specifyReferenceError(
          lastIndex,
          references[lastIndex],
          LIST_ERRORS.exportedItemDeletionMethodReferenceDuplicatedWithDifferentMethod,
        ),
      );
    }
  }
  return errors;
};

// gather-missing-deletion-methods-errors (:142-151): deleted ids
// without any provided reference id, SORTED.
const gatherMissingMethodsErrors = (
  deletedExportedItems: RawEssence[],
  references: unknown[],
): EssenceError[] => {
  const deletedIds = deletedExportedItems.map((item) =>
    String(item[ID_FIELD]),
  );
  const providedIds = new Set(
    references
      .filter((reference) => isMap(reference))
      .map((reference) => String((reference as RawEssence)[ID_FIELD])),
  );
  return deletedIds
    .filter((itemId) => !providedIds.has(itemId))
    .sort()
    .map((itemId) =>
      specifyIdDemonstratingError(
        itemId,
        LIST_ERRORS.exportedItemDeletionMethodMissing,
      ),
    );
};

// gather-deletion-methods-errors-for-deleted-exported-items (:172-217):
// the strict group cascade — the FIRST non-empty group wins.
const gatherDeletionMethodsErrors = (
  deletedExportedItems: RawEssence[],
  listUpdateData: RawEssence,
): EssenceError[] => {
  if (deletedExportedItems.length === 0) {
    return [];
  }
  // Group 1: top-level field checks (missing → empty → incorrect).
  const fieldError = exportedItemsDeletionMethodsMissing(listUpdateData)
    ? LIST_ERRORS.exportedItemsDeletionMethodsMissing
    : exportedItemsDeletionMethodsEmpty(listUpdateData)
      ? LIST_ERRORS.exportedItemsDeletionMethodsEmpty
      : exportedItemsDeletionMethodsIncorrect(listUpdateData)
        ? LIST_ERRORS.exportedItemsDeletionMethodsIncorrect
        : null;
  if (fieldError !== null) {
    return [{ ...fieldError }];
  }
  const references =
    listUpdateData[EXPORTED_ITEMS_DELETION_METHODS_FIELD] as unknown[];
  // Group 2: reference-not-a-map.
  const referencesErrors = gatherReferencesErrors(references);
  if (referencesErrors.length > 0) {
    return referencesErrors;
  }
  // Group 3: per reference id (empty → incorrect).
  const referencesIdsErrors = gatherReferencesIdsErrors(references);
  if (referencesIdsErrors.length > 0) {
    return referencesIdsErrors;
  }
  // Group 4: per reference deletionMethod (missing → empty →
  // incorrect).
  const deletionMethodErrors =
    gatherReferencesDeletionMethodErrors(references);
  if (deletionMethodErrors.length > 0) {
    return deletionMethodErrors;
  }
  // Group 5: same id with different methods.
  const duplicationErrors = gatherReferencesDuplicationErrors(
    references,
    buildEntriesById(references),
  );
  if (duplicationErrors.length > 0) {
    return duplicationErrors;
  }
  // Group 6: method missing for a deleted item.
  return gatherMissingMethodsErrors(deletedExportedItems, references);
};

// gather-exported-items-deletion-errors (the gatherer entry :219-232):
// payload items AND current items must be arrays, current non-empty;
// NO deleted item → nothing is validated at all (even garbage).
export const gatherExportedItemsDeletionErrors = (
  currentList: RawEssence,
  listUpdateData: RawEssence,
): EssenceError[] => {
  const currentItems = currentList[ITEMS_FIELD];
  const newerItems = listUpdateData[ITEMS_FIELD];
  if (
    !Array.isArray(newerItems) ||
    !Array.isArray(currentItems) ||
    currentItems.length === 0
  ) {
    return [];
  }
  const deletedExportedItems = findDeletedExportedItems(
    currentItems,
    newerItems,
    String(currentList[ID_FIELD]),
  );
  return gatherDeletionMethodsErrors(deletedExportedItems, listUpdateData);
};

// ===== Cascade (update.clj :55-93) =====

// get-exported-items-deletion-method-map (:55-58): {id → deletion-
// method}, maps only, later duplicates overwrite earlier like
// `into {}`.
const getDeletionMethodMap = (
  references: unknown[],
): Map<string, unknown> => {
  const methodMap = new Map<string, unknown>();
  for (const reference of references) {
    if (isMap(reference)) {
      methodMap.set(
        String((reference as RawEssence)[ID_FIELD]),
        (reference as RawEssence)[DELETION_METHOD_FIELD],
      );
    }
  }
  return methodMap;
};

// Stored items of a list document (bare id strings) resolved to the
// dereferenced form the valid-data path works on
// (get-list-with-dereferenced-items false).
const resolveItems = async (
  database: Db,
  listDocument: RawEssence,
): Promise<RawEssence[]> => {
  const storedItems = Array.isArray(listDocument[ITEMS_FIELD])
    ? (listDocument[ITEMS_FIELD] as unknown[])
    : [];
  const ownerId = String(listDocument[USER_ID_FIELD]);
  const resolved: RawEssence[] = [];
  for (const essenceId of storedItems) {
    if (typeof essenceId !== "string") {
      continue;
    }
    if (isListId(essenceId)) {
      const nested = await findListDocument(database, essenceId);
      if (nested !== null) {
        resolved.push({ [ID_FIELD]: nested[ID_FIELD], name: nested.name });
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

// update-importing-lists! (:60-71): for every most-recent list (≠ the
// original) whose stored items intersect the deleted ids, update via
// the VALID-data path with {:items …} only — fresh version-id,
// older-version-id chain, createdAt now, reason reset to the default
// + no-documented-reason=true (no contentful reason in {:items …}).
const updateImportingLists = async (
  database: Db,
  originalListId: string,
  deletedIds: string[],
  updateItems: (items: RawEssence[]) => RawEssence[],
): Promise<void> => {
  if (deletedIds.length === 0) {
    return;
  }
  // find-lists-with-items-from-original-list (database/sverniks/find.clj
  // :90): most-recent versions only, items $in the deleted ids, id ≠
  // the original list (stored items are BARE ID STRINGS).
  const importingLists = await database
    .collection(COLLECTIONS.lists)
    .find<RawEssence>({
      [NEWER_VERSION_ID_FIELD]: null,
      items: { $in: deletedIds },
      [ID_FIELD]: { $ne: originalListId },
    } as never)
    .toArray();
  for (const importingList of importingLists) {
    const currentItems = await resolveItems(database, importingList);
    const updatedItems = updateItems(currentItems);
    // link-essence-or-create-item-from-valid-data over the updated
    // items: bare references stay {id}; id-less copies become NEW
    // standalone items owned by the importing list.
    const listIdOfImporting = String(importingList[ID_FIELD]);
    const itemOrigin = (() => {
      const listUrl = importingList[URL_FIELD];
      return typeof listUrl === "string"
        ? listUrl.replace(/\/lists\/.*$/, "")
        : "";
    })();
    const mergedItems: RawEssence[] = [];
    for (const item of updatedItems) {
      if (typeof item[ID_FIELD] === "string") {
        mergedItems.push({ [ID_FIELD]: item[ID_FIELD] });
      } else {
        mergedItems.push(
          createItemFromValidData(
            item,
            listIdOfImporting,
            itemOrigin,
            String(importingList[USER_ID_FIELD]),
          ),
        );
      }
    }
    // update-list!-return-list: mark the previous version, insert the
    // new one. prepare-essence-as-new-mongo-document (inside
    // insert-svernik!-return-svernik → insertList) stores _id =
    // version-id, strips state/exported-to/has-exported-items, and
    // persists :new items as proper item documents.
    const currentVersionId = String(
      importingList[MONGO_ID_FIELD] ?? importingList[VERSION_ID_FIELD],
    );
    const newVersionId = generateUniqueEssenceId("list");
    await markUpdated(database, listIdOfImporting, newVersionId);
    const {
      _id: _previousMongoId,
      versionId: _previousVersionId,
      exportedTo: _exportedTo,
      hasExportedItems: _hasExportedItems,
      originalList: _originalList,
      ...restOfImporting
    } = importingList;
    await insertList(database, {
      ...restOfImporting,
      [VERSION_ID_FIELD]: newVersionId,
      [OLDER_VERSION_ID_FIELD]: currentVersionId,
      [NEWER_VERSION_ID_FIELD]: null,
      [CREATED_AT_FIELD]: new Date().toISOString(),
      [REASON_FOR_LATEST_UPDATE_FIELD]: REASON_FOR_LATEST_UPDATE_DEFAULT,
      [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD]:
        NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_DEFAULT,
      [ITEMS_FIELD]: mergedItems,
    });
  }
};

// ===== Entry (update.clj :172-200) =====

// The cascade entry for the PATCH route: split the deleted ids by
// their deletion method and run the deletion cascade, then the
// insertion cascade (Clojure runs both BEFORE the main list is
// persisted by the route's update-list!-return-list).
export const runExportedItemsDeletionCascade = async (
  database: Db,
  currentList: RawEssence,
  listUpdateData: RawEssence,
): Promise<void> => {
  const currentItems = currentList[ITEMS_FIELD];
  const newerItems = listUpdateData[ITEMS_FIELD];
  if (!Array.isArray(newerItems) || !Array.isArray(currentItems)) {
    return;
  }
  const deleted = findDeletedExportedItems(
    currentItems,
    newerItems,
    String(currentList[ID_FIELD]),
  );
  const deletionMethodMap = getDeletionMethodMap(
    (listUpdateData[EXPORTED_ITEMS_DELETION_METHODS_FIELD] ??
      []) as unknown[],
  );
  const listId = String(currentList[ID_FIELD]);
  const deletedIds = deleted.map((item) => String(item[ID_FIELD]));
  const idsForDeletion = deletedIds.filter(
    (itemId) => deletionMethodMap.get(itemId) === "deletion",
  );
  const idsForInsertion = deletedIds.filter(
    (itemId) => deletionMethodMap.get(itemId) === "insertion",
  );
  // delete-exported-items-from-importing-lists! (:73-81): the deleted
  // items are REMOVED; the remaining items become bare {id} refs.
  await updateImportingLists(database, listId, idsForDeletion, (items) =>
    items
      .filter((item) => !idsForDeletion.includes(String(item[ID_FIELD])))
      .map((item) => ({ [ID_FIELD]: item[ID_FIELD] })),
  );
  // insert-copied-exported-items-into-importing-lists! (:83-93): a
  // matching item becomes a COPY of the deleted item's user-provided
  // fields (NO id → a new standalone item); others become bare {id}.
  await updateImportingLists(database, listId, idsForInsertion, (items) =>
    items.map((item) => {
      const itemId = String(item[ID_FIELD]);
      return idsForInsertion.includes(itemId)
        ? pickUserProvidedFields(
            deleted.find(
              (deletedItem) => String(deletedItem[ID_FIELD]) === itemId,
            ),
          )
        : { [ID_FIELD]: item[ID_FIELD] };
    }),
  );
};

// select-keys item-user-provided-keywords (:91).
const pickUserProvidedFields = (item?: RawEssence): RawEssence => {
  const source: RawEssence = item ?? {};
  const copy: RawEssence = {};
  for (const field of ITEM_USER_PROVIDED_FIELDS) {
    copy[field] = source[field];
  }
  return copy;
};
