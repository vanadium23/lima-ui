// Svernik routes. Mirrors the POST/GET/HEAD/PATCH/DELETE parts of
// src/server/routes/sverniks.clj:
//  - POST /lists: gather errors (name → purpose → note → items) →
//    400 {errors: [...]}; else build + insert + 201 with the Location
//    header and the full dereferenced sorted body;
//  - GET/HEAD /lists/:listId: 200 sorted body / 404 {errors:
//    [{id: "list-not-found", ...}]};
//  - GET/HEAD /lists: every most-recent list of the user, each
//    enriched like the single read (show-lists-or-respond-with-error);
//  - GET/HEAD /count/lists: {listsCount: N} (get-lists-count);
//  - PATCH /lists/:listId: minimal updating happy path — new version
//    (same id, fresh versionId, chain updated), 200 sorted re-read;
//  - DELETE /lists/:listId: minimal deletion happy path — all versions
//    removed, 200 {text, affectedLists} (ok-deletion-result shape).
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import type { Db } from "mongodb";
import {
  countMostRecentLists,
  findAllMostRecentLists,
  findListDocument,
  findSvernik,
  insertList,
  insertNewVersion,
  markUpdated,
  prefetchItems,
  searchLists,
} from "../db/lists.ts";
import {
  ERRORS_FIELD,
  ERROR_ID_FIELD,
  ERROR_TEXT_FIELD,
  ID_FIELD,
  LOCATION_HEADER,
  AFFECTED_LISTS_FIELD,
  VERSION_ID_FIELD,
  OLDER_VERSION_ID_FIELD,
  NEWER_VERSION_ID_FIELD,
  CREATED_AT_FIELD,
  TYPE_FIELD,
  URL_FIELD,
  NAME_FIELD,
  PURPOSE_FIELD,
  ITEMS_FIELD,
  REASON_FOR_LATEST_UPDATE_FIELD,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD,
  NOTE_FIELD,
  USER_ID_FIELD,
  EXPORTED_ITEMS_DELETION_METHODS_FIELD,
} from "../domain/fields.ts";
import { ROUTES } from "../domain/constants.ts";
import {
  generateUniqueEssenceId,
} from "../domain/essences.ts";
import {
  LIST_TYPE,
  NOTE_DEFAULT,
  PURPOSE_DEFAULT,
  QUERY,
  REASON_FOR_LATEST_UPDATE_DEFAULT,
  type RawEssence,
  type SortedEssence,
} from "../domain/svernik.ts";
import type { ErrorPayload } from "../auth/middleware.ts";
import {
  authPreHandler,
  type ProtectedRouteDependencies,
} from "./protected-skeletons.ts";
import { gatherSvernikCreationErrors } from "../errors/svernik-create.ts";
import { LIST_ERRORS } from "../errors/svernik-errors.ts";
import type { EssenceError } from "../errors/svernik-errors.ts";
import {
  gatherNameUpdateErrors,
  gatherNoteUpdateErrors,
  gatherPurposeUpdateErrors,
  gatherReasonUpdateErrors,
  gatherSvernikIdUpdateErrors,
  updateRepeatsCurrentData,
} from "../errors/svernik-update.ts";
import { gatherItemsUpdateErrors } from "../errors/svernik-items.ts";
import { gatherSearchQueryErrors } from "../errors/search-query-errors-gatherer.ts";
import {
  gatherExportedItemsDeletionErrors,
  runExportedItemsDeletionCascade,
} from "../domain/exported-items.ts";
import {
  EssenceErrorWithAffectedEssences,
  LIST_DELETION_BODY_FIELDS,
  deleteListFromRawData,
} from "../domain/deletion-result.ts";
import {
  contentful,
  emptyAsStringValue,
} from "../domain/svernik-build.ts";
import { buildSvernik, mergeItemsData } from "../domain/svernik-build.ts";
import type { SortedJSON } from "../utilities/json.ts";
import { sendEssenceJSON, sendSortedJSON } from "../utilities/json.ts";
import { stableStringify } from "../utilities/json.ts";

const errorsBody = (
  errors: ErrorPayload[],
): { [ERRORS_FIELD]: ErrorPayload[] } => ({
  [ERRORS_FIELD]: errors.map((error) => ({ ...error })),
});

// The response documents carry only SortedJSON values (strings, nulls,
// booleans, arrays of documents).
const asSortedEssence = (essence: RawEssence): SortedEssence =>
  essence as unknown as SortedEssence;

export const createListHandler =
  (database: Db, serverUrl: string) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user!;
    const rawData = (request.body ?? {}) as RawEssence;
    const itemsCandidate = rawData[ITEMS_FIELD];
    const prefetched = await prefetchItems(
      database,
      Array.isArray(itemsCandidate) ? itemsCandidate : [],
      user.id,
    );
    const errors = await gatherSvernikCreationErrors(rawData, {
      prefetchedUpdatedItems: prefetched,
      getSvernik: async (svernikId) => findListDocument(database, svernikId),
    });
    if (errors.length > 0) {
      sendSortedJSON(reply, 400, errorsBody(errors));
      return;
    }
    const svernik = await buildSvernik(
      rawData,
      user.id,
      serverUrl,
      database,
      prefetched,
    );
    await insertList(database, svernik);
    const stored = await findSvernik(database, String(svernik[ID_FIELD]), user.id);
    reply.header(LOCATION_HEADER, `/lists/${String(svernik[ID_FIELD])}`);
    sendEssenceJSON(
      reply,
      201,
      asSortedEssence(stored ?? svernik) as SortedJSON,
    );
  };

export const showListHandler =
  (database: Db) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user!;
    const { listId } = request.params as { listId: string };
    const stored = await findSvernik(database, listId, user.id);
    if (stored === null) {
      sendSortedJSON(reply, 404, {
        [ERRORS_FIELD]: [
          {
            [ERROR_ID_FIELD]: LIST_ERRORS.listNotFound.id,
            [ERROR_TEXT_FIELD]: `Svernik with id '${listId}' is not found.`,
          },
        ],
      });
      return;
    }
    sendEssenceJSON(reply, 200, asSortedEssence(stored) as SortedJSON);
  };

// show-lists-or-respond-with-error: (ok (mapv get-sorted-svernik
// (get-sverniks user-id))) — an ARRAY of enriched lists; key ordering
// is applied per element at serialization time.
export const showListsHandler =
  (database: Db) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user!;
    const lists = await findAllMostRecentLists(database, user.id);
    sendEssenceJSON(
      reply,
      200,
      lists.map((list) => asSortedEssence(list)) as unknown as SortedJSON,
    );
  };

// show-lists-count-or-respond-with-error: (ok {:lists-count N}) — the
// keywords-fields correspondence renders it as {"listsCount": N}.
export const showListsCountHandler =
  (database: Db) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user!;
    const listsCount = await countMostRecentLists(database, user.id);
    sendSortedJSON(reply, 200, { listsCount } as SortedJSON);
  };

// search-lists-or-respond-with-error (server/routes/sverniks.clj
// :95-102): the WHOLE body-params map IS the search-data —
// svernik/sverniks/search.clj search-lists-from-raw-data passes it
// as-is and reads {:query …}; errors → bad-request-error (400),
// success → ok (200). The donor projects {id, name} ONLY and converts
// documents with identity, so the body is the plain [{id, name}]
// array.
export const searchListsHandler =
  (database: Db) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user!;
    const searchData = (request.body ?? {}) as RawEssence;
    const errors = gatherSearchQueryErrors(searchData);
    if (errors.length > 0) {
      sendSortedJSON(reply, 400, errorsBody(errors));
      return;
    }
    const foundLists = await searchLists(
      database,
      String(searchData[QUERY]),
      user.id,
    );
    sendEssenceJSON(reply, 200, foundLists as unknown as SortedJSON);
  };

// contentful-as-string? / empty-but-present? — the canonical helpers
// live in domain/svernik-build.ts (contentful) and errors/gather.ts
// (emptyAsString); the update flow mirrors svernik/sverniks/update.clj
// update-list-from-valid-data, which uses reason-contentful? and
// empty-but-present?.

// The PATCH body is projected to the user-provided keywords before any
// decision (server.routes.sverniks.clj update-list-or-respond-with-
// error: (select-keys (:body-params request) svernik-update-body-params-
// keys)) — non-relevant fields are dropped right at the door.
const SVERNIK_USER_PROVIDED_FIELDS = [
  NAME_FIELD,
  PURPOSE_FIELD,
  ITEMS_FIELD,
  REASON_FOR_LATEST_UPDATE_FIELD,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD,
  NOTE_FIELD,
  // server.routes.sverniks.clj :54-55: the update body projection
  // conj-s :exported-items-deletion-methods onto the user-provided
  // keys.
  EXPORTED_ITEMS_DELETION_METHODS_FIELD,
] as const;

// update-list-from-valid-data: merge the user-provided keys over the
// current list, then new version-id, older-version-id = previous
// version-id, created-at = now, merged items. reason-for-latest-update
// contentful → keep + mark=false; else reset to "" + mark=true.
// Explicitly empty-but-present purpose/note reset to their defaults.
export const updateListHandler =
  (database: Db, serverUrl: string) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user!;
    const { listId } = request.params as { listId: string };
    const body = (request.body ?? {}) as RawEssence;
    // (assoc (select-keys body user-provided-keys) :id svernik-id)
    const rawData: RawEssence = { id: listId };
    for (const field of SVERNIK_USER_PROVIDED_FIELDS) {
      if (field in body) {
        rawData[field] = body[field];
      }
    }
    // gather-svernik-update-data-errors, step 1: the id gate.
    const idErrors = gatherSvernikIdUpdateErrors(rawData);
    if (idErrors.length > 0) {
      sendSortedJSON(reply, 400, errorsBody(idErrors));
      return;
    }
    const current = await findSvernik(database, listId, user.id);
    if (current === null) {
      sendSortedJSON(reply, 404, {
        [ERRORS_FIELD]: [
          {
            [ERROR_ID_FIELD]: LIST_ERRORS.listNotFound.id,
            [ERROR_TEXT_FIELD]: `Svernik with id '${listId}' is not found.`,
          },
        ],
      });
      return;
    }
    // Step 2: (empty? (dissoc update-data :id)) → list-update-empty.
    const withoutId: RawEssence = { ...rawData };
    delete withoutId.id;
    if (Object.keys(withoutId).length === 0) {
      sendSortedJSON(reply, 400, errorsBody([LIST_ERRORS.listUpdateEmpty]));
      return;
    }
    // Step 3: essence-update-repeats-current-data? against the
    // CURRENT (dereferenced) list — structural equality.
    if (
      updateRepeatsCurrentData(
        current,
        withoutId,
        (value: unknown) => stableStringify(value as SortedJSON),
      )
    ) {
      sendSortedJSON(
        reply,
        400,
        errorsBody([LIST_ERRORS.listUpdateRepeatsCurrentContent]),
      );
      return;
    }
    // Step 4: gather-fields-errors — (juxt name items purpose reason
    // note), flattened in this order.
    const itemsCandidate = rawData[ITEMS_FIELD];
    const prefetched = await prefetchItems(
      database,
      Array.isArray(itemsCandidate) ? itemsCandidate : [],
      user.id,
    );
    const itemErrors = await gatherItemsUpdateErrors(
      rawData,
      {
        prefetchedUpdatedItems: prefetched,
        getSvernik: async (svernikId) =>
          findListDocument(database, svernikId),
      },
      listId,
    );
    const errors: EssenceError[] = [
      ...gatherNameUpdateErrors(rawData),
      ...itemErrors,
      ...gatherPurposeUpdateErrors(rawData),
      ...gatherReasonUpdateErrors(rawData),
      ...gatherNoteUpdateErrors(rawData),
      // gather-fields-errors: the exported-items deletion gatherer is
      // LAST in the juxt, after note (update.clj :95-103).
      ...gatherExportedItemsDeletionErrors(current, rawData),
    ];
    if (errors.length > 0) {
      sendSortedJSON(reply, 400, errorsBody(errors));
      return;
    }
    const reasonContentful = contentful(
      rawData,
      REASON_FOR_LATEST_UPDATE_FIELD,
    );
    const purposeEmpty =
      PURPOSE_FIELD in rawData && emptyAsStringValue(rawData[PURPOSE_FIELD]);
    const noteEmpty =
      NOTE_FIELD in rawData && emptyAsStringValue(rawData[NOTE_FIELD]);
    const newVersionId = generateUniqueEssenceId("list");
    const updated: RawEssence = {
      ...current,
      ...(typeof rawData.name === "string" ? { name: rawData.name } : {}),
      ...(contentful(rawData, PURPOSE_FIELD)
        ? { [PURPOSE_FIELD]: rawData[PURPOSE_FIELD] }
        : {}),
      ...(contentful(rawData, NOTE_FIELD)
        ? { [NOTE_FIELD]: rawData[NOTE_FIELD] }
        : {}),
      [VERSION_ID_FIELD]: newVersionId,
      [OLDER_VERSION_ID_FIELD]: current[VERSION_ID_FIELD],
      [NEWER_VERSION_ID_FIELD]: null,
      [CREATED_AT_FIELD]: new Date().toISOString(),
      [TYPE_FIELD]: LIST_TYPE,
      [URL_FIELD]: `${serverUrl}/lists/${listId}`,
      [ITEMS_FIELD]: Array.isArray(itemsCandidate)
        ? await mergeItemsData(
            itemsCandidate,
            listId,
            serverUrl,
            user.id,
            prefetched,
            database,
          )
        : reLinkCurrentItems(current[ITEMS_FIELD]),
      ...(reasonContentful
        ? {
            [REASON_FOR_LATEST_UPDATE_FIELD]:
              rawData[REASON_FOR_LATEST_UPDATE_FIELD],
            [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD]: false,
          }
        : {
            [REASON_FOR_LATEST_UPDATE_FIELD]:
              REASON_FOR_LATEST_UPDATE_DEFAULT,
            [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD]: true,
          }),
      ...(purposeEmpty ? { [PURPOSE_FIELD]: PURPOSE_DEFAULT } : {}),
      ...(noteEmpty ? { [NOTE_FIELD]: NOTE_DEFAULT } : {}),
    };
    // update-list!-return-list: chain the previous version, insert the
    // new one, answer with the re-read enriched document. The
    // exported-items deletion/insertion cascade runs FIRST, before the
    // main list is persisted (update.clj :194-200).
    await runExportedItemsDeletionCascade(database, current, rawData);
    await markUpdated(database, listId, newVersionId);
    const stored = await insertNewVersion(database, updated);
    sendEssenceJSON(reply, 200, asSortedEssence(stored) as SortedJSON);
  };

// merge-items-data nil branch: the current (dereferenced) items are
// re-linked — link-essence-or-create-item-from-valid-data of any
// essence document keeps only its bare {id} reference.
const reLinkCurrentItems = (currentItems: unknown): RawEssence[] => {
  const items = Array.isArray(currentItems) ? currentItems : [];
  return items.map((item) => ({
    [ID_FIELD]: String((item as RawEssence)[ID_FIELD]),
  }));
};

// delete-list-from-raw-data (delete.clj :190-209) through the route
// wrapper (server/routes/sverniks.clj :33-48): (select-keys body
// list-deletion-keywords) + assoc id from the URL, then
// 404 list-not-found / 400 errors / 200 DeletionResult. Deletion errors
// may carry affected-essences (the overflow error), so the body goes
// through the essence serializer whose error order is [id, text, …].
const essenceErrorBody = (
  errors: Array<
    EssenceError | EssenceErrorWithAffectedEssences
  >,
): { [ERRORS_FIELD]: unknown[] } => ({
  [ERRORS_FIELD]: errors.map((error) =>
    "affectedEssences" in error
      ? {
          [ERROR_ID_FIELD]: error.id,
          [ERROR_TEXT_FIELD]: error.text,
          affectedEssences: error.affectedEssences.map((essence) => ({
            [ID_FIELD]: essence.id,
            name: essence.name,
          })),
        }
      : { ...error },
  ),
});

export const deleteListHandler =
  (database: Db) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user!;
    const { listId } = request.params as { listId: string };
    const body = (request.body ?? {}) as RawEssence;
    // (assoc (select-keys (:body-params request) list-deletion-keywords)
    //        :id svernik-id)
    const rawData: RawEssence = { [ID_FIELD]: listId };
    for (const field of LIST_DELETION_BODY_FIELDS) {
      if (field in body) {
        rawData[field] = body[field];
      }
    }
    const outcome = await deleteListFromRawData(database, rawData, user.id);
    if ("errors" in outcome) {
      const firstError = outcome.errors[0];
      const isListNotFound =
        firstError !== undefined &&
        firstError.id === LIST_ERRORS.listNotFound.id;
      const payload = essenceErrorBody(outcome.errors);
      sendEssenceJSON(
        reply,
        isListNotFound ? 404 : 400,
        payload as unknown as SortedJSON,
      );
      return;
    }
    // DeletionResult spec: id + text + affected-lists
    // (svernik/domain/deletion_result.clj) — the essence serializer
    // keeps the [id, text, affectedLists] key order.
    sendEssenceJSON(
      reply,
      200,
      outcome.deletionResult as unknown as SortedJSON,
    );
  };

export const registerSvernikRoutes = (
  app: FastifyInstance,
  dependencies: ProtectedRouteDependencies & { serverUrl: string },
): void => {
  const preHandler = authPreHandler(dependencies);
  app.post(
    "/lists",
    { preHandler },
    createListHandler(dependencies.database, dependencies.serverUrl),
  );
  // GET/HEAD /lists: the automatic HEAD serves the same handler, like
  // the Clojure :head entry pointing at show-lists-or-respond-with-error.
  app.get("/lists", { preHandler }, showListsHandler(dependencies.database));
  app.get(
    "/lists/:listId",
    { preHandler },
    showListHandler(dependencies.database),
  );
  app.patch(
    "/lists/:listId",
    { preHandler },
    updateListHandler(dependencies.database, dependencies.serverUrl),
  );
  app.delete(
    "/lists/:listId",
    { preHandler },
    deleteListHandler(dependencies.database),
  );
  // LISTS_SEARCH_ROUTE (sverniks.clj :117-120) registers :post AND
  // :head pointing at the SAME search-lists-or-respond-with-error fn;
  // Fastify auto-HEAD covers only GET routes, so HEAD is registered
  // explicitly with the same handler.
  app.post(
    ROUTES.searchLists,
    { preHandler },
    searchListsHandler(dependencies.database),
  );
  app.head(
    ROUTES.searchLists,
    { preHandler },
    searchListsHandler(dependencies.database),
  );
  app.get(
    ROUTES.countLists,
    { preHandler },
    showListsCountHandler(dependencies.database),
  );
  // No explicit HEAD: Fastify serves HEAD for free on GET routes
  // (Clojure route map has :head → same handler — the automatic
  // HEAD path produces the same 200/404 contract).
};
