// Item routes. Mirrors the GET/HEAD parts of src/server/routes/
// items.clj (the PATCH half is ET-216+, the HEAD /items 501 stays).
// GET/HEAD /items/:itemId: 200 sorted item body / 404 {errors:
// [{id: "item-not-found", ...}]} (build-resource-getter with
// get-item). ET-220 adds the read: the removed-essences-remain
// feature explores items after their removal from a list.
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import type { Db } from "mongodb";
import { findItemDocument, findReferencingLists } from "../db/lists.ts";
import {
  COLLECTIONS,
  ERRORS_FIELD,
  ERROR_ID_FIELD,
  ERROR_TEXT_FIELD,
  ID_FIELD,
  ORIGINAL_LIST_FIELD,
  ORIGINAL_LIST_ID_FIELD,
} from "../domain/fields.ts";
import { LIST_ERRORS } from "../errors/svernik-errors.ts";
import type { ErrorPayload } from "../auth/middleware.ts";
import {
  authPreHandler,
  type ProtectedRouteDependencies,
} from "./protected-skeletons.ts";
import { ROUTES } from "../domain/constants.ts";
import type { RawEssence } from "../domain/svernik.ts";
import type { SortedJSON } from "../utilities/json.ts";
import { sendEssenceJSON, sendSortedJSON } from "../utilities/json.ts";

// get-item read path (database/items/find.clj find-item): exported-to
// lookup + original-list lookup ({id, name} of the owning list).
// Shared with the PATCH route (the 200 re-read is enriched the same
// way, routes/items-update.ts).
export const enrichItemForRead = async (
  database: Db,
  item: RawEssence,
): Promise<RawEssence> => {
  const originalListId =
    typeof item[ORIGINAL_LIST_ID_FIELD] === "string"
      ? item[ORIGINAL_LIST_ID_FIELD]
      : null;
  const exportedTo = await findReferencingLists(
    database,
    String(item[ID_FIELD]),
    originalListId,
  );
  const enriched: RawEssence = { ...item, exportedTo };
  if (originalListId !== null) {
    const owner = await database
      .collection(COLLECTIONS.lists)
      .findOne({ [ID_FIELD]: originalListId } as never, {
        projection: { [ID_FIELD]: 1, name: 1 },
      });
    if (owner !== null) {
      enriched[ORIGINAL_LIST_FIELD] = {
        id: owner.id,
        name: owner.name,
      };
    }
  }
  return enriched;
};

// build-resource-getter with get-item: 200 sorted / 404 item-not-found.
export const showItemHandler =
  (database: Db) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user!;
    const { itemId } = request.params as { itemId: string };
    const stored = await findItemDocument(database, itemId, user.id);
    if (stored === null) {
      const notFound: ErrorPayload = {
        [ERROR_ID_FIELD]: LIST_ERRORS.itemNotFound.id,
        [ERROR_TEXT_FIELD]: `Item with id '${itemId}' is not found.`,
      };
      sendSortedJSON(reply, 404, {
        [ERRORS_FIELD]: [notFound],
      } as SortedJSON);
      return;
    }
    const enriched = await enrichItemForRead(database, stored);
    sendEssenceJSON(reply, 200, enriched as unknown as SortedJSON);
  };

export const registerItemRoutes = (
  app: FastifyInstance,
  dependencies: ProtectedRouteDependencies,
): void => {
  const preHandler = authPreHandler(dependencies);
  app.get(
    ROUTES.item,
    { preHandler },
    showItemHandler(dependencies.database),
  );
  // No explicit HEAD: Fastify serves HEAD for free on GET routes
  // (the Clojure :head entry points at the same handler).
};
