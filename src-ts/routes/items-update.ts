// Item update route. Mirrors the PATCH half of src/server/routes/
// items.clj (update-item-or-respond-with-error) + svernik/items/
// update.clj (update-item-from-raw-data / update-item-from-valid-data)
// + the four item error gatherers (item_{content,purpose,note,reason_
// for_latest_update}_errors_gatherer.clj) + svernik.errors.item-errors
// (the 6 static ids/texts). Flow: id gate (item-id-incorrect) → load
// current item (user-scoped) → 404 item-not-found → empty-update check
// (body WITHOUT id) → repeats-current check → per-field gatherers
// (content → purpose → note → reason) → 200 with the RE-READ enriched
// item (update-item!-return-item re-finds after persist).
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import type { Db } from "mongodb";
import {
  essenceToDocument,
  findItemDocument,
} from "../db/lists.ts";
import {
  COLLECTIONS,
  ERRORS_FIELD,
  ERROR_ID_FIELD,
  ERROR_TEXT_FIELD,
  ID_FIELD,
  NEWER_VERSION_ID_FIELD,
  OLDER_VERSION_ID_FIELD,
  VERSION_ID_FIELD,
} from "../domain/fields.ts";
import {
  CONTENT,
  ITEM_CONTENT_MAX_LENGTH,
  NOTE,
  PURPOSE,
  REASON_FOR_LATEST_UPDATE,
  isItemId,
  isNotEmptyString,
  isString,
  type RawEssence,
} from "../domain/svernik.ts";
import { LIST_ERRORS } from "../errors/svernik-errors.ts";
import type { EssenceError } from "../errors/svernik-errors.ts";
import {
  emptyAsString,
  gatherFieldErrorsSync,
  type ValidationCheck,
} from "../errors/gather.ts";
import { someAndIncorrect } from "../errors/svernik-name-purpose-note.ts";
import {
  generateUniqueEssenceId,
} from "../domain/essences.ts";
import {
  authPreHandler,
  type ProtectedRouteDependencies,
} from "./protected-skeletons.ts";
import { ROUTES } from "../domain/constants.ts";
import type { SortedJSON } from "../utilities/json.ts";
import { sendEssenceJSON, sendSortedJSON, stableStringify } from "../utilities/json.ts";
import { enrichItemForRead } from "./items.ts";

// server.routes.items.clj: (assoc (select-keys (:body-params request)
// item-user-provided-keywords) :id item-id) — svernik.domain.item/
// item-user-provided-keywords, camelCase on the wire. The projection
// drops non-relevant fields at the door (item_updating_with_non_
// relevant_fields feature).
const ITEM_USER_PROVIDED_FIELDS = [
  CONTENT,
  PURPOSE,
  REASON_FOR_LATEST_UPDATE,
  NOTE,
] as const;

// ===== svernik.errors.item-errors (item_errors.clj) — the 6 static
// error ids/texts, verbatim (item-content-max-length interpolated like
// the donor's format call). The svernik-items.ts entries with the same
// ids are the LIST-level template variants (index + item demonstration)
// — the item route uses the static ones. =====
const staticError = (id: string, text: string): EssenceError => ({ id, text });

export const ITEM_ERRORS = {
  itemContentEmpty: staticError(
    "item-content-empty",
    "The required item's 'content' field is empty.",
  ),
  itemContentIncorrect: staticError(
    "item-content-incorrect",
    "The required item's 'content' field should be the non-empty string.",
  ),
  itemContentTooLong: staticError(
    "item-content-too-long",
    `The required item's 'content' field should be no longer than ${ITEM_CONTENT_MAX_LENGTH} symbols.`,
  ),
  purposeIncorrect: staticError(
    "purpose-incorrect",
    "The optional item's 'purpose' field should be string.",
  ),
  noteIncorrect: staticError(
    "note-incorrect",
    "The optional item's 'note' field should be string.",
  ),
  reasonForLatestUpdateIncorrect: staticError(
    "reason-for-latest-update-incorrect",
    "The optional item's 'reasonForLatestUpdate' field should be string.",
  ),
} as const;

// ===== gatherers (item_*_errors_gatherer.clj) =====

// item_content_errors_gatherer.clj item-content-empty? (empty-as-string?
// on :content): present as null/"" — the absent key maps to the
// not-found sentinel → not empty (errors/gather.ts emptyAsString).
const itemContentEmpty = (data: RawEssence): boolean =>
  emptyAsString(data, CONTENT);

// item-content-incorrect?: contains? AND spec not-empty-string? fails.
// null/"" are caught by empty? first; false/123/{}/[] → incorrect.
const itemContentIncorrect = (data: RawEssence): boolean =>
  CONTENT in data && !isNotEmptyString(data[CONTENT]);

// item-content-too-long?: (count value) > item-content-max-length.
// Only strings survive the earlier checks in the vector; the isString
// guard keeps countOf semantics for the unreachable non-string tail.
const itemContentTooLong = (data: RawEssence): boolean =>
  CONTENT in data && isString(data[CONTENT]) &&
  data[CONTENT].length > ITEM_CONTENT_MAX_LENGTH;

// item_purpose/item_note/item_reason gatherers: some-and-incorrect?
// against the plain string? specs — present AND non-nil AND not a
// string. null and "" pass validation (empty-as-string resets happen
// at apply time); an ABSENT key is no error.
const itemPurposeIncorrect = (data: RawEssence): boolean =>
  someAndIncorrect(data, PURPOSE);

const itemNoteIncorrect = (data: RawEssence): boolean =>
  someAndIncorrect(data, NOTE);

const itemReasonForLatestUpdateIncorrect = (data: RawEssence): boolean =>
  someAndIncorrect(data, REASON_FOR_LATEST_UPDATE);

// gather-fields-errors (update.clj :58-63): the juxt ORDER is content →
// purpose → note → reason; each gatherer yields at most ONE error
// (first firing check wins, utilities.clj gather-field-errors);
// results are flattened.
const gatherItemUpdateFieldErrors = (updateData: RawEssence): EssenceError[] => {
  const contentErrors = gatherFieldErrorsSync(updateData, [
    [itemContentEmpty, ITEM_ERRORS.itemContentEmpty],
    [itemContentIncorrect, ITEM_ERRORS.itemContentIncorrect],
    [itemContentTooLong, ITEM_ERRORS.itemContentTooLong],
  ] satisfies ValidationCheck[]);
  const purposeErrors = gatherFieldErrorsSync(updateData, [
    [itemPurposeIncorrect, ITEM_ERRORS.purposeIncorrect],
  ] satisfies ValidationCheck[]);
  const noteErrors = gatherFieldErrorsSync(updateData, [
    [itemNoteIncorrect, ITEM_ERRORS.noteIncorrect],
  ] satisfies ValidationCheck[]);
  const reasonErrors = gatherFieldErrorsSync(updateData, [
    [
      itemReasonForLatestUpdateIncorrect,
      ITEM_ERRORS.reasonForLatestUpdateIncorrect,
    ],
  ] satisfies ValidationCheck[]);
  return [
    ...contentErrors,
    ...purposeErrors,
    ...noteErrors,
    ...reasonErrors,
  ];
};

// ===== svernik.items.update =====

// gather-item-update-data-errors (update.clj :65-77): not-found →
// update-empty (body WITHOUT id is empty) → repeats-current → fields.
const gatherItemUpdateDataErrors = (
  currentItem: RawEssence | null,
  updateData: RawEssence,
): EssenceError[] => {
  const withoutId: RawEssence = { ...updateData };
  delete withoutId[ID_FIELD];
  if (currentItem === null) {
    const itemId = String(updateData[ID_FIELD]);
    return [
      {
        id: LIST_ERRORS.itemNotFound.id,
        text: `Item with id '${itemId}' is not found.`,
      },
    ];
  }
  if (Object.keys(withoutId).length === 0) {
    return [LIST_ERRORS.itemUpdateEmpty];
  }
  if (
    updateRepeatsCurrentItemData(
      currentItem,
      withoutId,
      (value: unknown) => stableStringify(value as SortedJSON),
    )
  ) {
    return [LIST_ERRORS.itemUpdateRepeatsCurrentContent];
  }
  return gatherItemUpdateFieldErrors(updateData);
};

// essence-update-repeats-current-data? (essence_update_repeats_current_
// content.clj): structural equality (Clojure =) of the projected update
// data against the current item's SAME fields. JSON-only payload →
// stableStringify comparison (same twin as svernik-update.ts). Items
// have no no-documented-reason key, so the donor's dissoc branch is a
// no-op here.
const updateRepeatsCurrentItemData = (
  currentItem: RawEssence,
  updateDataWithoutId: RawEssence,
  stringify: (value: unknown) => string,
): boolean => {
  const keys = Object.keys(updateDataWithoutId);
  return keys.every((key) => {
    const current: unknown = currentItem[key];
    const incoming: unknown = updateDataWithoutId[key];
    if (current === null || current === undefined) {
      return incoming === null || incoming === undefined;
    }
    if (incoming === null || incoming === undefined) {
      return false;
    }
    return stringify(current) === stringify(incoming);
  });
};

// update-item-from-valid-data (update.clj :29-56): a NEW version
// document cloned from the current one — new version-id (which becomes
// the Mongo _id on persist), older-version-id = the current version-id,
// newer-version-id null, state :updated, created-at = now;
// original-list-id and user-id carry over; contentful content/purpose/
// note are applied; purpose/note empty-as-string (null/"") reset to
// their defaults; reason contentful → value, else → default (the empty
// branch covers the ABSENT key too — reason-empty? = (not contentful-
// as-string?), unlike purpose/note).
export const updateItemFromValidData = (
  currentItem: RawEssence,
  updateData: RawEssence,
): RawEssence => {
  // contentful-as-string?: the value is a non-empty string (null/""/
  // non-strings are not contentful).
  const contentful = (field: string): boolean =>
    typeof updateData[field] === "string" && updateData[field] !== "";
  const newVersionId = generateUniqueEssenceId("item");
  const updated: RawEssence = {
    ...currentItem,
    [ID_FIELD]: currentItem[ID_FIELD],
    [VERSION_ID_FIELD]: newVersionId,
    [OLDER_VERSION_ID_FIELD]: currentItem[VERSION_ID_FIELD],
    [NEWER_VERSION_ID_FIELD]: null,
    state: "updated",
    createdAt: new Date().toISOString(),
  };
  if (contentful(CONTENT)) {
    updated[CONTENT] = updateData[CONTENT];
  }
  if (contentful(PURPOSE)) {
    updated[PURPOSE] = updateData[PURPOSE];
  } else if (PURPOSE in updateData && updateData[PURPOSE] !== undefined) {
    // purpose-empty? (reason-empty? = empty-as-string?): null or "".
    updated[PURPOSE] = updateData[PURPOSE] === null ||
      updateData[PURPOSE] === ""
      ? ""
      : updateData[PURPOSE];
  }
  if (contentful(NOTE)) {
    updated[NOTE] = updateData[NOTE];
  } else if (NOTE in updateData && updateData[NOTE] !== undefined) {
    updated[NOTE] = updateData[NOTE] === null || updateData[NOTE] === ""
      ? ""
      : updateData[NOTE];
  }
  // reason-for-latest-update: contentful → value; otherwise reset to
  // the default "" UNCONDITIONALLY (absent key included).
  if (contentful(REASON_FOR_LATEST_UPDATE)) {
    updated[REASON_FOR_LATEST_UPDATE] =
      updateData[REASON_FOR_LATEST_UPDATE];
  } else {
    updated[REASON_FOR_LATEST_UPDATE] = "";
  }
  return updated;
};

// update-item!-return-item (database/items/update.clj): prepare the new
// version as a Mongo document (_id = version-id, no :state leaked), set
// newer-version-id on the PREVIOUS most-recent version (the filter MUST
// include newer-version-id: null — without it 3+ chained updates
// corrupt the chain; the ET-215 precedent), insert the new version,
// then re-find the fresh one.
const updateItemReturnItem = async (
  database: Db,
  newVersion: RawEssence,
): Promise<RawEssence> => {
  await database.collection(COLLECTIONS.items).updateOne(
    {
      [ID_FIELD]: newVersion[ID_FIELD],
      [NEWER_VERSION_ID_FIELD]: null,
    } as never,
    { $set: { [NEWER_VERSION_ID_FIELD]: newVersion[VERSION_ID_FIELD] } } as never,
  );
  await database
    .collection(COLLECTIONS.items)
    .insertOne(essenceToDocument(newVersion));
  const stored = await findItemDocument(
    database,
    String(newVersion[ID_FIELD]),
    String(newVersion.userId),
  );
  // The version was just inserted — the re-read cannot miss.
  return stored ?? newVersion;
};

// ===== server.routes.items.clj =====

// update-item-or-respond-with-error: projection → 404 → 400 → ok-item
// (get-sorted-item — key ordering applied at serialization time).
export const updateItemHandler =
  (database: Db) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user!;
    const { itemId } = request.params as { itemId: string };
    const body = (request.body ?? {}) as RawEssence;
    const updateData: RawEssence = { [ID_FIELD]: itemId };
    for (const field of ITEM_USER_PROVIDED_FIELDS) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }
    // gather-item-id-update-errors: contains-and-incorrect? on :id vs
    // item-id? (specify-id-demonstrating-error → the provided id in the
    // text). The URL id is always present — only the shape can fail.
    if (!isItemId(itemId)) {
      sendSortedJSON(reply, 400, {
        [ERRORS_FIELD]: [
          {
            [ERROR_ID_FIELD]: LIST_ERRORS.itemIdIncorrect.id,
            [ERROR_TEXT_FIELD]: LIST_ERRORS.itemIdIncorrect.template.replace(
              "%s",
              itemId,
            ),
          },
        ],
      } as SortedJSON);
      return;
    }
    const currentItem = await findItemDocument(database, itemId, user.id);
    const errors = gatherItemUpdateDataErrors(currentItem, updateData);
    if (errors.length > 0) {
      const notFound = errors[0]?.id === LIST_ERRORS.itemNotFound.id;
      sendSortedJSON(reply, notFound ? 404 : 400, {
        [ERRORS_FIELD]: errors.map((error) => ({ ...error })),
      } as SortedJSON);
      return;
    }
    const newVersion = updateItemFromValidData(
      currentItem as RawEssence,
      updateData,
    );
    const stored = await updateItemReturnItem(database, newVersion);
    // ok-item over the RE-READ version; enrich-item-for-read adds the
    // runtime exported-to + original-list {id, name} like GET does.
    const enriched = await enrichItemForRead(database, stored);
    sendEssenceJSON(reply, 200, enriched as unknown as SortedJSON);
  };

export const registerItemUpdateRoutes = (
  app: FastifyInstance,
  dependencies: ProtectedRouteDependencies,
): void => {
  const preHandler = authPreHandler(dependencies);
  // No HEAD here: GET /items/:itemId (routes/items.ts) already serves
  // HEAD automatically; a second HEAD registration would throw.
  app.patch(
    ROUTES.item,
    { preHandler },
    updateItemHandler(dependencies.database),
  );
};
