// utilities.properly-sorted-JSON, ported: extracts the JSON field names
// from the RAW response text in order and checks the sequence reduces
// to nothing by subtracting the domain keyword orders (donor algorithm
// preserved, including the shift-based index arithmetic).
import {
  ERRORS_KEYWORDS_ORDER,
  ERROR_KEYWORDS_ORDER,
  ITEM_KEYWORDS_ORDER,
  LINKED_LIST_KEYWORDS_ORDER,
  SVERNIK_KEYWORDS_ORDER,
} from "../../src-ts/domain/svernik.ts";

const ERROR_WITH_AFFECTED_ESSENCES_KEYWORDS_ORDER = [
  ...ERROR_KEYWORDS_ORDER,
  "affectedEssences",
] as const;

const arraysEqual = (a: readonly string[], b: readonly string[]): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const subtractVector = (originalMinuend: string[], subtrahend: string[]): string[] => {
  let minuend = originalMinuend;
  let shift = 0;
  for (;;) {
    const subtrahendStart = minuend.indexOf(subtrahend[0]!);
    const subtrahendEnd = subtrahendStart + subtrahend.length;
    const subtractionImpossible =
      subtrahendStart === -1 || subtrahendEnd > minuend.length;
    if (subtractionImpossible) {
      return originalMinuend;
    }
    if (arraysEqual(minuend.slice(subtrahendStart, subtrahendEnd), subtrahend)) {
      return [
        ...originalMinuend.slice(0, shift + subtrahendStart),
        ...originalMinuend.slice(shift + subtrahendEnd),
      ];
    }
    minuend = minuend.slice(1);
    shift += 1;
  }
};

const keywordsSortedAsRequired = (
  shortenKeys: (keys: string[]) => string[],
  someKeys: string[],
): boolean => {
  const shortenedKeys = shortenKeys(someKeys);
  if (shortenedKeys.length === 0) {
    return true;
  }
  if (shortenedKeys.length < someKeys.length) {
    return keywordsSortedAsRequired(shortenKeys, shortenedKeys);
  }
  return false;
};

const JSON_FIELD_MASK = /"([^\\"]+)":/g;

const someJsonProperlySorted = (
  keywordsSortedInRequiredWay: (keys: string[]) => boolean,
  someJson: string,
): boolean => {
  const fields: string[] = [];
  for (const match of someJson.matchAll(JSON_FIELD_MASK)) {
    fields.push(match[1]!);
  }
  return keywordsSortedInRequiredWay(fields);
};

const subtractItemThenSvernikKeywords = (keywords: string[]): string[] =>
  subtractVector(
    subtractVector(
      subtractVector(keywords, [...LINKED_LIST_KEYWORDS_ORDER]),
      [...ITEM_KEYWORDS_ORDER],
    ),
    [...SVERNIK_KEYWORDS_ORDER],
  );

export const essenceJsonProperlySorted = (essenceJson: string): boolean =>
  someJsonProperlySorted(
    (keys) => keywordsSortedAsRequired(subtractItemThenSvernikKeywords, keys),
    essenceJson,
  );

const subtractErrorThenErrorsKeywords = (keywords: string[]): string[] =>
  subtractVector(
    subtractVector(
      subtractVector(
        subtractVector(keywords, [...LINKED_LIST_KEYWORDS_ORDER]),
        [...ERROR_WITH_AFFECTED_ESSENCES_KEYWORDS_ORDER],
      ),
      [...ERROR_KEYWORDS_ORDER],
    ),
    [...ERRORS_KEYWORDS_ORDER],
  );

export const errorsJsonProperlySorted = (errorsJson: string): boolean =>
  someJsonProperlySorted(
    (keys) => keywordsSortedAsRequired(subtractErrorThenErrorsKeywords, keys),
    errorsJson,
  );

// svernik.domain.deletion-result deletion-result-keywords-order,
// fieldified.
const DELETION_RESULT_KEYWORDS_ORDER = ["text", "affectedLists"] as const;

const subtractDeletionResultKeywords = (keywords: string[]): string[] =>
  subtractVector(keywords, [...DELETION_RESULT_KEYWORDS_ORDER]);

export const deletionResultJsonProperlySorted = (
  deletionResultJson: string,
): boolean =>
  someJsonProperlySorted(
    (keys) => keywordsSortedAsRequired(subtractDeletionResultKeywords, keys),
    deletionResultJson,
  );
