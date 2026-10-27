// Search-query error gatherer. Mirrors
// src/svernik/errors/search_query_errors_gatherer.clj — FIVE checks in
// the donor order, first match wins (gather-field-errors =
// some-like): missing → incorrect → empty-as-string → too-short →
// too-long. NOTE the donor checks missing? BEFORE incorrect? (unlike
// the name/purpose/note gatherers' contains-and-incorrect patterns).
import {
  isStringOrNull,
  NAME_MAX_LENGTH,
  QUERY,
  SEARCH_QUERY_MIN_LENGTH,
  type RawEssence,
} from "../domain/svernik.ts";
import {
  countOf,
  emptyAsString,
  gatherFieldErrorsSync,
  missing,
  tooLongString,
  type ValidationCheck,
} from "./gather.ts";
import { SEARCH_ERRORS } from "./search-errors.ts";
import type { EssenceError } from "./svernik-errors.ts";

// contains-and-incorrect? with the svernik.domain.search/query spec
// ((spec/or :query string? :query nil?)): [] {} true false →
// incorrect, null → valid (and caught by the empty check next).
const queryIncorrect = (rawData: RawEssence): boolean =>
  QUERY in rawData && !isStringOrNull(rawData[QUERY]);

export const gatherSearchQueryErrors = (
  rawData: RawEssence,
): EssenceError[] =>
  gatherFieldErrorsSync(rawData, [
    [(data) => missing(data, QUERY), SEARCH_ERRORS.searchQueryMissing],
    [(data) => queryIncorrect(data), SEARCH_ERRORS.searchQueryIncorrect],
    [(data) => emptyAsString(data, QUERY), SEARCH_ERRORS.searchQueryEmpty],
    [
      // too-short-string?: (count value) < :search-query-min-length.
      (data) => SEARCH_QUERY_MIN_LENGTH > countOf(data[QUERY]),
      SEARCH_ERRORS.searchQueryTooShort,
    ],
    [
      // too-long-string? against :name-max-length ("we search only by
      // name, so we cap the length" — search_query_errors_gatherer.clj).
      (data) => tooLongString(data, QUERY, NAME_MAX_LENGTH),
      SEARCH_ERRORS.searchQueryTooLong,
    ],
  ]);
