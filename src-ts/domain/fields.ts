// Mongo document field names. The Clojure backend stores essences with
// camelCase field names produced by fieldify-essence-keyword
// (src/utilities/keywords_fields_correspondence.clj + the
// svernik-raw-data-description constants), not with dashed keywords.
export const MONGO_ID_FIELD = "_id";
export const VERSION_ID_FIELD = "versionId";
export const CREATED_AT_FIELD = "createdAt";
export const EMAIL_FIELD = "email";
export const PASSWORD_FIELD = "password";
export const NAME_FIELD = "name";
export const EMAIL_VERIFIED_FIELD = "emailVerified";
export const TOKEN_FIELD = "token";
export const USER_ID_FIELD = "userId";
// svernik-raw-data-description/token-raw-data-description: "type".
export const TOKEN_TYPE_FIELD = "type";
export const USER_AGENT_FIELD = "user-agent";
export const IP_FIELD = "ip";

// Response-level JSON keys (keyword-field correspondence).
export const ID_FIELD = "id";
export const ERRORS_FIELD = "errors";
export const ERROR_ID_FIELD = "id";
export const ERROR_TEXT_FIELD = "text";
export const TOKEN_RESPONSE_FIELD = "token";
export const GREETING_FIELD = "greeting";
export const RESULT_FIELD = "result";

export const DATABASE_NAME = "svernik";

// NOTE: the Clojure lists collection is named "sverniks"
// (src/database/utilities/sverniks_collection.clj → (.getCollection db
// "sverniks")), NOT "lists" — the JVM-prepared test data and the
// Clojure-created lists land there; the TS backend must use the same
// collection.
export const COLLECTIONS = {
  users: "users",
  sessions: "sessions",
  tokens: "tokens",
  lists: "sverniks",
  items: "items",
} as const;

// Essence document/wire fields beyond the auth ones
// (svernik_raw_data_description).
export const OLDER_VERSION_ID_FIELD = "olderVersionId";
export const NEWER_VERSION_ID_FIELD = "newerVersionId";
export const TYPE_FIELD = "type";
export const URL_FIELD = "URL";
export const PURPOSE_FIELD = "purpose";
export const ITEMS_FIELD = "items";
export const NOTE_FIELD = "note";
export const REASON_FOR_LATEST_UPDATE_FIELD = "reasonForLatestUpdate";
export const NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD =
  "noDocumentedReasonForLatestUpdate";
export const CONTENT_FIELD = "content";
export const ORIGINAL_LIST_FIELD = "originalList";
export const ORIGINAL_LIST_ID_FIELD = "originalListId";
export const EXPORTED_TO_FIELD = "exportedTo";
export const HAS_EXPORTED_ITEMS_FIELD = "hasExportedItems";
// deletion-result wire keys (deletion-keys correspondence):
// {:affected-lists AFFECTED_LISTS} → "affectedLists".
export const AFFECTED_LISTS_FIELD = "affectedLists";
// exported-items deletion wire keys (svernik_raw_data_description.clj
// :46,48).
export const EXPORTED_ITEMS_DELETION_METHODS_FIELD =
  "exportedItemsDeletionMethods";
export const DELETION_METHOD_FIELD = "deletionMethod";
export const LOCATION_HEADER = "location";
