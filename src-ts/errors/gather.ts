// Error gatherer helpers mirroring src/svernik/errors/utilities.clj
// (gather-field-errors: FIRST matching predicate wins, at most ONE error
// per call), utilities/error.clj (specify-item-error: format the
// template with the item index and the JSON representation of the item)
// and utilities/string_measurements.clj + incorrect.clj predicates.
import type { RawEssence } from "../domain/svernik.ts";
import type {
  EssenceError,
  EssenceErrorTemplate,
} from "./svernik-errors.ts";
import { stableStringify } from "../utilities/json.ts";
import type { SortedJSON } from "../utilities/json.ts";

export type ValidationCheck = [
  (data: RawEssence) => boolean | Promise<boolean>,
  EssenceError | EssenceErrorTemplate | ((data: RawEssence) => EssenceError),
];

export const missing = (data: RawEssence, field: string): boolean =>
  !(field in data);

// empty-as-string?: (str value) is empty. Clojure (str …) semantics:
// nil → "", "" → "", collections print as "[]"/"{…}" (non-empty!),
// numbers/bools print their value. An ABSENT key maps to the
// "not-found-and-thus-not-empty" sentinel → non-empty.
export const emptyAsString = (data: RawEssence, field: string): boolean => {
  if (!(field in data)) {
    return false;
  }
  const value = data[field];
  return value === null || value === "";
};

// too-long-string?: (count value) > length. Note: count works on
// strings AND collections (nil → 0).
export const countOf = (value: unknown): number => {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === "string") {
    return value.length;
  }
  if (Array.isArray(value)) {
    return value.length;
  }
  if (typeof value === "object") {
    return Object.keys(value).length;
  }
  // Numbers etc. — Clojure (count 123) throws; the gatherers only call
  // too-long on fields that already passed the string checks, so this
  // branch is unreachable in the contract flows; treat as 1.
  return 1;
};

export const tooLongString = (
  data: RawEssence,
  field: string,
  length: number,
): boolean => length < countOf(data[field]);

// is-plain-string spec on user-provided optional string fields
// (svernik.domain.item/purpose etc. are plain string?): nil fails
// string?, so some-and-incorrect? with nil value → incorrect.
export const isNonString = (value: unknown): boolean =>
  typeof value !== "string";

// specify-item-error: format(template, index, item-as-JSON). The item
// is serialized as JSON — maps with sorted keys (sorted-map), anything
// else via its JSON representation (null, numbers, strings, arrays).
export const specifyItemError = (
  itemIndex: number,
  item: unknown,
  template: EssenceErrorTemplate,
): EssenceError => ({
  id: template.id,
  text: formatTemplate(
    template.template,
    String(itemIndex),
    item === undefined ? "null" : stableStringify(item as SortedJSON),
  ),
});

// Java String.format %s / %d replacement for the two placeholder forms
// the error templates use.
export const formatTemplate = (
  template: string,
  first: string,
  second: string,
): string => {
  let firstUsed = false;
  return template.replace(/%d|%s/g, (match) => {
    if (match === "%d") {
      return first;
    }
    if (!firstUsed) {
      // The first %s consumes the index ONLY for templates with %d %s
      // pairs handled by callers passing both through; here templates
      // carry exactly %d then %s.
      firstUsed = true;
      return second;
    }
    return second;
  });
};

// gather-field-errors: the first firing check decides the (single)
// error; none firing → no error. Checks may be async (DB lookups).
export const gatherFieldErrors = async (
  data: RawEssence,
  checks: ValidationCheck[],
): Promise<EssenceError[]> => {
  for (const [invalid, errorSource] of checks) {
    if (await invalid(data)) {
      return [resolveError(errorSource, data)];
    }
  }
  return [];
};

// Sync twin for check vectors with no DB lookups.
export const gatherFieldErrorsSync = (
  data: RawEssence,
  checks: ValidationCheck[],
): EssenceError[] => {
  for (const [invalid, errorSource] of checks) {
    if (invalid(data) === true) {
      return [resolveError(errorSource, data)];
    }
  }
  return [];
};

const resolveError = (
  errorSource:
    | EssenceError
    | EssenceErrorTemplate
    | ((data: RawEssence) => EssenceError),
  data: RawEssence,
): EssenceError => {
  if (typeof errorSource === "function") {
    return errorSource(data);
  }
  if ("template" in errorSource) {
    return {
      id: errorSource.id,
      text: formatTemplate(errorSource.template, "", ""),
    };
  }
  return { ...errorSource };
};
