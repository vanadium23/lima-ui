// svernik.domain.errors is-errors / element-of-type, ported as plain
// predicates: exact key sets + per-field value specs. Also the
// svernik.domain.svernik / item domain specs (is-svernik, is-item),
// the svernik user-provided keywords and the per-field specification
// registry used by utilities.is-essence-field-valid.
import { is, equalsValue } from "../support/world.ts";
import {
  ITEM_KEYWORDS_ORDER,
  ITEM_TYPE,
  LIST_TYPE,
  SVERNIK_KEYWORDS_ORDER,
  isItemId,
  isLinkToEssenceId,
  isListId,
} from "../../src-ts/domain/svernik.ts";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): boolean =>
  typeof value === "string" && value !== "";

const exactKeys = (value: Record<string, unknown>, keys: string[]): boolean =>
  equalsValue(Object.keys(value).sort(), [...keys].sort());

// svernik.domain.essence svernik-id?: id string with the essence prefix
// ("list-..."). Affected essences only ever reference lists here.
const isSvernikId = (value: unknown): boolean =>
  typeof value === "string" && value.startsWith("list-");

const isLinkedList = (value: unknown): boolean => {
  if (!isPlainObject(value)) {
    return false;
  }
  return (
    exactKeys(value, ["id", "name"]) &&
    isSvernikId(value.id) &&
    isNonEmptyString(value.name)
  );
};

const isErrorEntry = (value: unknown): boolean => {
  if (!isPlainObject(value)) {
    return false;
  }
  if (exactKeys(value, ["id", "text"])) {
    return isNonEmptyString(value.id) && isNonEmptyString(value.text);
  }
  if (exactKeys(value, ["id", "text", "affectedEssences"])) {
    return (
      isNonEmptyString(value.id) &&
      isNonEmptyString(value.text) &&
      Array.isArray(value.affectedEssences) &&
      value.affectedEssences.every(isLinkedList)
    );
  }
  return false;
};

// is-errors: map with the exact key set {errors}, where errors is a
// vector of error / error-with-affected-essences maps.
export const isErrorsValue = (value: unknown): boolean => {
  if (!isPlainObject(value)) {
    return false;
  }
  return (
    exactKeys(value, ["errors"]) &&
    Array.isArray(value.errors) &&
    value.errors.every(isErrorEntry)
  );
};

export const isErrors = (value: unknown): void => {
  is(isErrorsValue(value), `Expected an errors envelope, got: ${JSON.stringify(value)}`);
};

// ---- svernik.domain.utilities: shared value specs ----------------------

// essence-id?: "<prefix>-<anything>" strings.
const isUserId = (value: unknown): boolean =>
  typeof value === "string" && /^user-.+$/.test(value);

// with-created-at UTC-date-string?: Instant.parse on the JVM side; an
// ISO-8601 parse is the JS equivalent for the values the backends emit.
const isIsoUtcDateString = (value: unknown): boolean =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

// with-URL URL-string?: java.net.URL construction; new URL() mirrors it.
const isUrlString = (value: unknown): boolean => {
  if (typeof value !== "string") {
    return false;
  }
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isBoolean = (value: unknown): boolean => typeof value === "boolean";
const isString = (value: unknown): boolean => typeof value === "string";

// svernik.domain.with-required-reasons.default / .empty: spec/keys over
// the reason-and-mark pair (the value specs only — spec/keys does not
// forbid extra keys).
export const isWithDocumentedReasonForLatestUpdate = (value: unknown): boolean =>
  isPlainObject(value) &&
  isNonEmptyString(value.reasonForLatestUpdate) &&
  value.noDocumentedReasonForLatestUpdate === false;

export const isWithoutDocumentedReasonForLatestUpdate = (value: unknown): boolean =>
  isPlainObject(value) &&
  value.reasonForLatestUpdate === "" &&
  value.noDocumentedReasonForLatestUpdate === true;

// svernik.domain.deletion-result is-deletion-result: value spec first,
// exact key set second (same shape as is-svernik / is-item).
export const isDeletionResult = (value: unknown): void => {
  is(
    isPlainObject(value) &&
      isLinkToEssenceId(value.id) &&
      isNonEmptyString(value.text) &&
      Array.isArray(value.affectedLists) &&
      value.affectedLists.every(isListId),
    `Expected a valid deletion result, got: ${JSON.stringify(value)}.`,
  );
  is(
    isPlainObject(value) && exactKeys(value, ["id", "text", "affectedLists"]),
    `Expected deletion result keys ["id", "text", "affectedLists"], got ${JSON.stringify(Object.keys(value as object))}.`,
  );
};

// with-exported-to: nilable vector of link-to-list maps.
export const isExportedTo = (value: unknown): boolean =>
  value === null || (Array.isArray(value) && value.every(isLinkedList));

// ---- svernik.domain.svernik / item -------------------------------------

// with-required-reasons: spec/or of the two merges — either a documented
// reason (non-empty string + flag false) or the empty variant
// (reason "" + flag true).
const isReasonAndMarkValid = (value: Record<string, unknown>): boolean =>
  (isNonEmptyString(value.reasonForLatestUpdate) &&
    value.noDocumentedReasonForLatestUpdate === false) ||
  (value.reasonForLatestUpdate === "" &&
    value.noDocumentedReasonForLatestUpdate === true);

const svernikSpecValid = (value: Record<string, unknown>): boolean =>
  isListId(value.id) &&
  isListId(value.versionId) &&
  (value.olderVersionId === null || isListId(value.olderVersionId)) &&
  (value.newerVersionId === null || isListId(value.newerVersionId)) &&
  value.type === LIST_TYPE &&
  isIsoUtcDateString(value.createdAt) &&
  isUrlString(value.URL) &&
  isNonEmptyString(value.name) &&
  isString(value.purpose) &&
  isItemsVector(value.items) &&
  isReasonAndMarkValid(value) &&
  isString(value.note) &&
  isExportedTo(value.exportedTo) &&
  isBoolean(value.hasExportedItems) &&
  isUserId(value.userId);

// item spec has no reason variants: reason-for-latest-update is a plain
// string, noDocumentedReasonForLatestUpdate is not part of the key set.
const itemSpecValid = (value: Record<string, unknown>): boolean =>
  isItemId(value.id) &&
  isItemId(value.versionId) &&
  (value.olderVersionId === null || isItemId(value.olderVersionId)) &&
  (value.newerVersionId === null || isItemId(value.newerVersionId)) &&
  value.type === ITEM_TYPE &&
  isIsoUtcDateString(value.createdAt) &&
  isUrlString(value.URL) &&
  isNonEmptyString(value.content) &&
  isString(value.purpose) &&
  isString(value.reasonForLatestUpdate) &&
  isString(value.note) &&
  isLinkedList(value.originalList) &&
  isListId(value.originalListId) &&
  isExportedTo(value.exportedTo) &&
  isUserId(value.userId);

// items: vector of item-or-svernik (mutual recursion, donor spec/or).
export const isItemsVector = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.every((item) => isItemValue(item) || isSvernikValue(item));

const isElementOfType = (
  value: unknown,
  keywordsOrder: readonly string[],
  specValid: (value: Record<string, unknown>) => boolean,
): boolean =>
  isPlainObject(value) &&
  specValid(value) &&
  exactKeys(value, [...keywordsOrder]);

// element-of-type? equivalent: value spec + exact key set.
export const isSvernikValue = (value: unknown): boolean =>
  isElementOfType(value, SVERNIK_KEYWORDS_ORDER, svernikSpecValid);

export const isItemValue = (value: unknown): boolean =>
  isElementOfType(value, ITEM_KEYWORDS_ORDER, itemSpecValid);

// is-svernik / is-item: two asserts, value spec first, key set second.
const isElementOfTypeAssert = (
  value: unknown,
  keywordsOrder: readonly string[],
  specValid: (value: Record<string, unknown>) => boolean,
  description: string,
): void => {
  is(
    isPlainObject(value) && specValid(value),
    `Expected a valid ${description}, got: ${JSON.stringify(value)}.`,
  );
  is(
    isPlainObject(value) && exactKeys(value, [...keywordsOrder]),
    `Expected ${description} keys ${JSON.stringify([...keywordsOrder])}, got ${JSON.stringify(value === null ? null : Object.keys(value as object))}.`,
  );
};

export const isSvernik = (value: unknown): void =>
  isElementOfTypeAssert(value, SVERNIK_KEYWORDS_ORDER, svernikSpecValid, "svernik");

export const isItem = (value: unknown): void =>
  isElementOfTypeAssert(value, ITEM_KEYWORDS_ORDER, itemSpecValid, "item");

// svernik-user-provided-keywords, fieldified (keywords-fields-
// correspondence maps each of these to its camelCase JSON name — the
// mapping is the identity here).
export const SVERNIK_USER_PROVIDED_KEYWORDS = [
  "name",
  "purpose",
  "items",
  "reasonForLatestUpdate",
  "noDocumentedReasonForLatestUpdate",
  "note",
] as const;

// item-user-provided-keywords (svernik.domain.item), fieldified.
export const ITEM_USER_PROVIDED_KEYWORDS = [
  "content",
  "purpose",
  "reasonForLatestUpdate",
  "note",
] as const;

// Per-field specification registry for is-essence-field-valid: the spec
// qualified names the donor steps reference.
export type EssenceFieldSpecification = (value: unknown) => boolean;

export const ESSENCE_FIELD_SPECIFICATIONS: Record<string, EssenceFieldSpecification> =
  {
    "svernik.domain.svernik/id": isListId,
    "svernik.domain.svernik/version-id": isListId,
    "svernik.domain.svernik/older-version-id": (value) =>
      value === null || isListId(value),
    "svernik.domain.svernik/newer-version-id": (value) =>
      value === null || isListId(value),
    "svernik.domain.svernik/type": (value) => value === LIST_TYPE,
    "svernik.domain.svernik/name": isNonEmptyString,
    "svernik.domain.svernik/purpose": isString,
    "svernik.domain.with-URL/URL": isUrlString,
    "svernik.domain.with-created-at/created-at": isIsoUtcDateString,
    // Entries required by the svernik exploring / creating / updating
    // catalogs, each mirroring the donor domain specification.
    "svernik.domain.with-user-id/user-id": isUserId,
    "svernik.domain.with-note/note": isString,
    "svernik.domain.svernik/items": isItemsVector,
    "svernik.domain.with-exported-to/exported-to": isExportedTo,
    "svernik.domain.svernik/has-exported-items": isBoolean,
    "svernik.domain.with-required-reasons.empty/reason-for-latest-update": (
      value,
    ) => value === "",
    "svernik.domain.with-required-reasons.empty/no-documented-reason-for-latest-update":
      (value) => value === true,
    // with-required-reasons.default mark spec is false? (the donor's
    // default.clj field description): the documented-reason variant.
    "svernik.domain.with-required-reasons.default/no-documented-reason-for-latest-update":
      (value) => value === false,
    // Entries required by the item domain catalogs, each mirroring the
    // donor svernik.domain.item / link-to-list / required-reasons specs.
    "svernik.domain.item/id": isItemId,
    "svernik.domain.item/version-id": isItemId,
    "svernik.domain.item/older-version-id": (value) =>
      value === null || isItemId(value),
    "svernik.domain.item/newer-version-id": (value) =>
      value === null || isItemId(value),
    "svernik.domain.item/type": (value) => value === ITEM_TYPE,
    "svernik.domain.item/content": isNonEmptyString,
    "svernik.domain.item/purpose": isString,
    "svernik.domain.item/reason-for-latest-update": isString,
    "svernik.domain.item/original-list-id": isListId,
    "svernik.domain.link-to-list/link-to-list": isLinkedList,
    "svernik.domain.with-required-reasons.default/reason-for-latest-update":
      isNonEmptyString,
  };
