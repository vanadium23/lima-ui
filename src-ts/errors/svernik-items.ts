// Items error gatherer. Mirrors src/svernik/errors/
// svernik_items_errors_gatherer.clj: per-item reference checks and
// item-essence/content checks in the exact Clojure order, one error max
// per item, errors collected for ALL items (flattened, in item order).
import {
  CONTENT,
  ID,
  isItemId,
  isListId,
  isNotEmptyString,
  ITEM_CONTENT_MAX_LENGTH,
  ITEMS,
  NOTE,
  PURPOSE,
  REASON_FOR_LATEST_UPDATE,
  type RawEssence,
} from "../domain/svernik.ts";
import {
  emptyAsString,
  formatTemplate,
  gatherFieldErrors,
  missing,
  specifyItemError,
  tooLongString,
  type ValidationCheck,
} from "./gather.ts";
import { gatherNoteErrors, someAndIncorrect } from "./svernik-name-purpose-note.ts";
import { LIST_ERRORS } from "./svernik-errors.ts";
import type { EssenceError, EssenceErrorTemplate } from "./svernik-errors.ts";

export interface PrefetchedItems {
  [itemId: string]: RawEssence | null;
}

export interface ReferenceContext {
  prefetchedUpdatedItems: PrefetchedItems;
  getSvernik: (
    svernikId: string,
  ) => RawEssence | null | Promise<RawEssence | null>;
}

// potentially-recursive-svernik? (svernik_items_errors_gatherer.clj
// :50-60): the reference id joins the chain; when the referenced
// svernik document carries that id (or any nested svernik in its
// dereferenced items does), the reference is recursive. get-parsed-
// svernik dereferences items, so nested sverniks appear as type:"list"
// documents among items; here the stored document carries BARE id
// strings — a nested id hit in the chain is the same cycle.
const potentiallyRecursiveSvernik = async (
  context: ReferenceContext,
  chain: string[],
  svernikId: string,
): Promise<boolean> => {
  if (chain.includes(svernikId)) {
    return true;
  }
  const svernik = await context.getSvernik(svernikId);
  if (svernik === null) {
    return false;
  }
  const items = Array.isArray(svernik.items) ? svernik.items : [];
  for (const item of items) {
    const nestedId =
      typeof item === "object" && item !== null && !Array.isArray(item)
        ? (item as RawEssence).id
        : item;
    if (typeof nestedId === "string" && isListId(nestedId)) {
      if (
        await potentiallyRecursiveSvernik(
          context,
          [...chain, svernikId],
          nestedId,
        )
      ) {
        return true;
      }
    }
  }
  return false;
};

// recursive-referencing?: a list-id reference whose target already
// (in)directly references the list being updated. selfId is the id of
// the updated list (nil at creation — the check cannot fire).
const recursiveReferencing =
  (context: ReferenceContext, selfId: string | null) =>
  async (itemData: RawEssence): Promise<boolean> => {
    if (selfId === null) {
      return false;
    }
    const essenceId = itemData[ID];
    if (!isListId(essenceId)) {
      return false;
    }
    return potentiallyRecursiveSvernik(context, [selfId], essenceId);
  };

// reference-empty?: empty-as-string? on :id.
const referenceEmpty = (itemData: RawEssence): boolean =>
  emptyAsString(itemData, ID);

// reference-incorrect?: id present AND neither item-id? nor svernik-id?.
const referenceIncorrect = (itemData: RawEssence): boolean =>
  ID in itemData && !isItemId(itemData[ID]) && !isListId(itemData[ID]);

// reference-unavailable?: svernik-id → list must exist; item-id →
// prefetched entry must exist; anything else → true.
const referenceUnavailable =
  (context: ReferenceContext) =>
  async (itemData: RawEssence): Promise<boolean> => {
    const id = itemData[ID];
    if (isListId(id)) {
      return (await context.getSvernik(id)) === null;
    }
    if (isItemId(id)) {
      const found = context.prefetchedUpdatedItems[id];
      return found === undefined || found === null;
    }
    return true;
  };

// essence-update-repeats-current-data?: update fields (all keys except
// :id; :no-documented-reason dropped when :reason present) equal the
// current essence state. nil current → false.
const updateRepeatsCurrentData = (
  currentEssence: RawEssence | null,
  updateData: RawEssence,
): boolean => {
  if (currentEssence === null) {
    return false;
  }
  const filtered = { ...updateData };
  if (REASON_FOR_LATEST_UPDATE in filtered) {
    delete filtered.noDocumentedReasonForLatestUpdate;
  }
  const keys = Object.keys(filtered);
  if (keys.length === 0) {
    return false;
  }
  return keys.every(
    (key) => (currentEssence[key] ?? null) === (filtered[key] ?? null),
  );
};

// reference-update-repeat-current?: item-id reference WITH extra
// payload that merely repeats the current state.
const referenceUpdateRepeatCurrent =
  (context: ReferenceContext) =>
  (itemData: RawEssence): boolean => {
    const essenceId = itemData[ID];
    if (!isItemId(essenceId)) {
      return false;
    }
    const withoutId = { ...itemData };
    delete withoutId[ID];
    if (Object.keys(withoutId).length === 0) {
      return false;
    }
    const currentItem = context.prefetchedUpdatedItems[essenceId] ?? null;
    return updateRepeatsCurrentData(currentItem, withoutId);
  };

// item-incorrect?: NOT a map (string, number, bool, null, array).
const itemIncorrect = (itemData: unknown): boolean =>
  typeof itemData !== "object" || itemData === null || Array.isArray(itemData);

// item-content-missing?: :content key absent.
const itemContentMissing = (itemData: RawEssence): boolean =>
  missing(itemData, CONTENT);

// item-content-empty?: empty-as-string? on :content (nil/"" → true;
// absent → sentinel → false; 123/"[]"/"{}" → str non-empty → false).
const itemContentEmpty = (itemData: RawEssence): boolean =>
  emptyAsString(itemData, CONTENT);

// item-content-incorrect?: contains? AND spec not-empty-string? fails:
// present, non-nil, and either not a string or an empty string.
// (""/null are caught by empty? earlier; false/123/{}/[] → incorrect.)
const itemContentIncorrect = (itemData: RawEssence): boolean =>
  CONTENT in itemData && itemData[CONTENT] !== null &&
  !isNotEmptyString(itemData[CONTENT]);

// item-content-too-long?: longer than 200.
const itemContentTooLong = (itemData: RawEssence): boolean =>
  tooLongString(itemData, CONTENT, ITEM_CONTENT_MAX_LENGTH);

type SpecError = EssenceError | EssenceErrorTemplate;

const specify =
  (itemIndex: number, item: unknown) =>
  (template: SpecError) =>
    "template" in template
      ? specifyItemError(itemIndex, item, template)
      : { ...template };

// get-reference-checks order: empty → incorrect → unavailable →
// recursive-referencing → repeat-current (svernik_items_errors_
// gatherer.clj get-reference-checks). At CREATION selfId is nil and
// the recursive check cannot fire (Clojure passes nil svernik-id);
// the PATCH route passes the updated list's id.
const getReferenceChecks = (
  itemIndex: number,
  item: unknown,
  context: ReferenceContext,
  selfId: string | null = null,
): ValidationCheck[] => {
  const spec = specify(itemIndex, item);
  return [
    [referenceEmpty, spec(LIST_ERRORS.referenceEmpty)],
    [referenceIncorrect, spec(LIST_ERRORS.referenceIncorrect)],
    [referenceUnavailable(context), spec(LIST_ERRORS.referenceUnavailable)],
    [
      recursiveReferencing(context, selfId),
      spec(LIST_ERRORS.recursiveReferencing),
    ],
    [
      referenceUpdateRepeatCurrent(context),
      spec(LIST_ERRORS.referenceUpdateRepeatCurrent),
    ],
  ];
};

// get-item-essence-checks: item-incorrect → content-missing.
const getItemEssenceChecks = (
  itemIndex: number,
  item: unknown,
): ValidationCheck[] => {
  const spec = specify(itemIndex, item);
  return [
    [itemIncorrect, spec(LIST_ERRORS.itemIncorrect)],
    [itemContentMissing, spec(LIST_ERRORS.itemContentMissing)],
  ];
};

// note-incorrect? predicate (shared with the list gatherer:
// some-and-incorrect? on :note).
const noteIncorrect = (itemData: RawEssence): boolean =>
  someAndIncorrect(itemData, NOTE);

// get-item-checks: content-empty → content-incorrect → content-too-long
// → reason-incorrect → purpose-incorrect → note-incorrect.
const getItemChecks = (itemIndex: number, item: unknown): ValidationCheck[] => {
  const spec = specify(itemIndex, item);
  return [
    [itemContentEmpty, spec(LIST_ERRORS.itemContentEmpty)],
    [itemContentIncorrect, spec(LIST_ERRORS.itemContentIncorrect)],
    [itemContentTooLong, spec(LIST_ERRORS.itemContentTooLong)],
    [
      (data: RawEssence) => someAndIncorrect(data, REASON_FOR_LATEST_UPDATE),
      spec(LIST_ERRORS.itemReasonForLatestUpdateIncorrect),
    ],
    [
      (data: RawEssence) => someAndIncorrect(data, PURPOSE),
      spec(LIST_ERRORS.itemPurposeIncorrect),
    ],
    [noteIncorrect, spec(LIST_ERRORS.itemNoteIncorrect)],
  ];
};

// has-item-user-payload?: any of content/purpose/reason/note present.
const ITEM_USER_PROVIDED = [
  CONTENT,
  PURPOSE,
  REASON_FOR_LATEST_UPDATE,
  NOTE,
] as const;
export const hasItemUserPayload = (itemData: RawEssence): boolean =>
  ITEM_USER_PROVIDED.some((key) => key in itemData);

// formatTemplate re-exported for the item update route (ET-216+).
export { formatTemplate };

// gather-errors-by-items: one error max per item, ALL items.
const gatherErrorsByItems = async (
  itemsData: unknown[],
  context: ReferenceContext,
  selfId: string | null = null,
): Promise<EssenceError[]> => {
  const errors: EssenceError[] = [];
  for (let index = 0; index < itemsData.length; index++) {
    const item = itemsData[index];
    const isMap = typeof item === "object" && item !== null &&
      !Array.isArray(item);
    // Non-map items fail item-incorrect immediately (Clojure checks
    // the map? predicate on the raw value, not on a substituted {}).
    if (!isMap) {
      errors.push(
        ...(await gatherFieldErrors({} as RawEssence, [
          [
            (): boolean => true,
            specify(index, item)(LIST_ERRORS.itemIncorrect),
          ],
        ])),
      );
      continue;
    }
    const itemData = item as RawEssence;
    const hasId = ID in itemData;
    const hasItemId = hasId && isItemId(itemData[ID]);
    const hasPayload = hasId && hasItemUserPayload(itemData);
    let checks: ValidationCheck[];
    if (hasId && !hasItemId) {
      checks = getReferenceChecks(index, item, context, selfId);
    } else if (hasItemId && hasPayload) {
      checks = [
        ...getReferenceChecks(index, item, context, selfId),
        ...getItemChecks(index, item),
      ];
    } else if (hasId) {
      checks = getReferenceChecks(index, item, context, selfId);
    } else {
      checks = [
        ...getItemEssenceChecks(index, item),
        ...getItemChecks(index, item),
      ];
    }
    errors.push(...(await gatherFieldErrors(itemData, checks)));
  }
  return errors;
};

// items-incorrect?: present AND (not nil AND not an array).
export const itemsIncorrect = (rawData: RawEssence): boolean => {
  const items = rawData[ITEMS];
  return !(items === undefined || items === null || Array.isArray(items));
};

// items-empty?: nil OR (sequential AND empty). NOTE: absent :items
// gives NO error — Clojure reads (:items data NOT_FOUND) and the
// not-found sentinel is neither nil nor an empty sequential
// (svernik_items_errors_gatherer.clj items-empty?).
export const itemsEmpty = (rawData: RawEssence): boolean =>
  rawData[ITEMS] === null ||
  (Array.isArray(rawData[ITEMS]) && (rawData[ITEMS] as unknown[]).length === 0);

// items-too-many-elements?: count > 500.
export const itemsTooManyElements = (rawData: RawEssence): boolean =>
  Array.isArray(rawData[ITEMS]) &&
  (rawData[ITEMS] as unknown[]).length > 500;

// items-missing?: the key is absent.
export const itemsMissing = (rawData: RawEssence): boolean =>
  missing(rawData, ITEMS);

interface ListChecksResult {
  errors: EssenceError[];
  itemsIsVector: boolean;
}

const gatherItemsErrors = async (
  rawData: RawEssence,
  context: ReferenceContext,
  extraChecks: ValidationCheck[],
): Promise<ListChecksResult> => {
  const baseChecks: ValidationCheck[] = [
    [(data) => itemsIncorrect(data), LIST_ERRORS.itemsIncorrect],
    [(data) => itemsEmpty(data), LIST_ERRORS.itemsEmpty],
    [(data) => itemsTooManyElements(data), LIST_ERRORS.itemsTooManyElements],
  ];
  const itemsErrors = await gatherFieldErrors(rawData, [
    ...extraChecks,
    ...baseChecks,
  ]);
  const items = rawData[ITEMS];
  return { errors: itemsErrors, itemsIsVector: Array.isArray(items) };
};

// gather-items-creation-errors: extra=[items-missing]; list-level
// checks first, then per-item errors when the items array is reachable.
// selfId is nil at creation (recursive-referencing cannot fire).
export const gatherItemsCreationErrors = async (
  rawData: RawEssence,
  context: ReferenceContext,
): Promise<EssenceError[]> => {
  const { errors, itemsIsVector } = await gatherItemsErrors(rawData, context, [
    [(data) => itemsMissing(data), LIST_ERRORS.itemsMissing],
  ]);
  if (errors.length > 0 || !itemsIsVector) {
    return errors;
  }
  return gatherErrorsByItems(rawData[ITEMS] as unknown[], context, null);
};

// gather-items-update-errors (ET-220): same without [items-missing];
// selfId enables recursive-referencing for the PATCH flow.
export const gatherItemsUpdateErrors = async (
  rawData: RawEssence,
  context: ReferenceContext,
  selfId: string,
): Promise<EssenceError[]> => {
  const { errors, itemsIsVector } = await gatherItemsErrors(
    rawData,
    context,
    [],
  );
  if (errors.length > 0 || !itemsIsVector) {
    return errors;
  }
  return gatherErrorsByItems(rawData[ITEMS] as unknown[], context, selfId);
};
