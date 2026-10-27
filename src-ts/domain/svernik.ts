// Svernik (list) domain constants and types. Mirrors
// src/server/utilities/svernik_raw_data_description.clj (raw-data keys),
// src/svernik/domain/svernik.clj + item.clj + link_to_list.clj
// (keywords orders) and src/config.clj static-config (limits).
import type { SortedJSON } from "../utilities/json.ts";

// Limits: src/config.clj static-config — hardwired, .env does NOT
// override them (the Clojure backend reads the same static map).
export const NAME_MAX_LENGTH = 70;
export const PURPOSE_MAX_LENGTH = 150;
export const NOTE_MAX_LENGTH = 500;
export const ITEM_CONTENT_MAX_LENGTH = 200;
export const LISTS_MAX_LENGTH = 200;
export const ITEMS_MAX_LENGTH = 500;

export const LIST_TYPE = "list";
export const ITEM_TYPE = "item";

// Search (svernik.domain.search): the POST/HEAD /search/lists body IS
// the search-data; {:query value} is its only meaningful key. The
// :search-query-min-length limit comes from src/config.clj
// static-config (:search-query-min-length 2).
export const QUERY = "query";
export const SEARCH_QUERY_MIN_LENGTH = 2;

// Essence ids are "<type>-<anything>" strings
// (svernik.domain.utilities.essence_id).
export const listIdRegex = /^list-.+$/;
export const itemIdRegex = /^item-.+$/;
export const isListId = (value: unknown): value is string =>
  typeof value === "string" && listIdRegex.test(value);
export const isItemId = (value: unknown): value is string =>
  typeof value === "string" && itemIdRegex.test(value);
// link-to-essence-id?: item-id? OR svernik-id?.
export const isLinkToEssenceId = (value: unknown): boolean =>
  isItemId(value) || isListId(value);

// Fieldified (camelCase) JSON keys the suite sees on the wire.
export const ID = "id";
export const VERSION_ID = "versionId";
export const OLDER_VERSION_ID = "olderVersionId";
export const NEWER_VERSION_ID = "newerVersionId";
export const TYPE = "type";
export const CREATED_AT = "createdAt";
export const URL_FIELD = "URL";
export const NAME = "name";
export const PURPOSE = "purpose";
export const ITEMS = "items";
export const NOTE = "note";
export const REASON_FOR_LATEST_UPDATE = "reasonForLatestUpdate";
export const NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE =
  "noDocumentedReasonForLatestUpdate";
export const CONTENT = "content";
export const ORIGINAL_LIST = "originalList";
export const ORIGINAL_LIST_ID = "originalListId";
export const EXPORTED_TO = "exportedTo";
export const HAS_EXPORTED_ITEMS = "hasExportedItems";
export const USER_ID = "userId";
export const ERRORS = "errors";

// Defaults (svernik_raw_data_description).
export const PURPOSE_DEFAULT = "";
export const NOTE_DEFAULT = "";
export const REASON_FOR_LATEST_UPDATE_DEFAULT = "";
export const NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_DEFAULT = true;
export const EXPORTED_TO_DEFAULT: SortedJSON[] = [];
export const HAS_EXPORTED_ITEMS_DEFAULT = false;
export const OLDER_VERSION_ID_DEFAULT = null;
export const NEWER_VERSION_ID_DEFAULT = null;
export const ITEMS_DEFAULT: RawEssence[] = [];

// Keyword orders drive the response key ordering (get-map-sorted-by-order
// sorts maps by indexOf in these vectors). The suite's
// properly-sorted-JSON utility parses the raw JSON and checks the key
// sequence against the same orders.
export const SVERNIK_KEYWORDS_ORDER = [
  ID,
  VERSION_ID,
  OLDER_VERSION_ID,
  NEWER_VERSION_ID,
  TYPE,
  CREATED_AT,
  URL_FIELD,
  NAME,
  PURPOSE,
  ITEMS,
  REASON_FOR_LATEST_UPDATE,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE,
  NOTE,
  EXPORTED_TO,
  HAS_EXPORTED_ITEMS,
  USER_ID,
] as const;

export const ITEM_KEYWORDS_ORDER = [
  ID,
  VERSION_ID,
  OLDER_VERSION_ID,
  NEWER_VERSION_ID,
  TYPE,
  CREATED_AT,
  URL_FIELD,
  CONTENT,
  PURPOSE,
  REASON_FOR_LATEST_UPDATE,
  NOTE,
  ORIGINAL_LIST,
  ORIGINAL_LIST_ID,
  EXPORTED_TO,
  USER_ID,
] as const;

export const LINKED_LIST_KEYWORDS_ORDER = [ID, NAME] as const;

export const ERROR_KEYWORDS_ORDER = ["id", "text"] as const;
export const ERRORS_KEYWORDS_ORDER = [ERRORS] as const;

// Raw essence as it arrives from the JSON body: keys are the fieldified
// camelCase names (the suite JSON-encodes user data as-is).
export type RawEssence = { [key: string]: unknown };

// A sorted essence ready to serialize: every value must be SortedJSON.
export type SortedEssence = { [key: string]: SortedJSON };

// The Clojure domain specs on user-provided fields, reduced to
// predicates the error gatherers need.
export const isString = (value: unknown): value is string =>
  typeof value === "string";
// not-empty-string?: string AND not empty.
export const isNotEmptyString = (value: unknown): value is string =>
  isString(value) && value.length > 0;
// string?: string OR nil (spec/keys values may be nil; clojure string?
// is false for nil, but the with-note spec is plain string? — nil fails
// it; nil is caught earlier by the some?/missing? guards).
export const isStringOrNull = (value: unknown): value is string | null =>
  value === null || isString(value);
