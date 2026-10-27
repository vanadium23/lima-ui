// Search error definitions. Mirrors
// src/svernik/errors/search_errors.clj — five errors, texts byte-equal
// to the donor (the min/max lengths are formatted from the
// static-config values :search-query-min-length and :name-max-length).
import {
  NAME_MAX_LENGTH,
  SEARCH_QUERY_MIN_LENGTH,
} from "../domain/svernik.ts";
import type { EssenceError } from "./svernik-errors.ts";

const staticError = (id: string, text: string): EssenceError => ({ id, text });

export const SEARCH_ERRORS = {
  searchQueryMissing: staticError(
    "search-query-missing",
    "The required parameter 'query' is missing.",
  ),
  searchQueryIncorrect: staticError(
    "search-query-incorrect",
    "The required parameter 'query' should be the non-empty string.",
  ),
  searchQueryEmpty: staticError(
    "search-query-empty",
    "The required parameter 'query' is empty.",
  ),
  searchQueryTooShort: staticError(
    "search-query-too-short",
    `The required parameter 'query' should be no shorter than ${SEARCH_QUERY_MIN_LENGTH} characters.`,
  ),
  searchQueryTooLong: staticError(
    "search-query-too-long",
    `The required parameter 'query' should be no longer than ${NAME_MAX_LENGTH} characters.`,
  ),
} as const;
