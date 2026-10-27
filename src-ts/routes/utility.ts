// Dev-only utility routes (env/dev/clj/server/utility_routes.clj):
// POST clears a collection, GET explains itself with a plain string
// body. GET /clear-users is exercised by the request_clear_database
// feature; it deletes accounts, so the next login re-seeds them.
import type { FastifyInstance } from "fastify";
import type { Db } from "mongodb";
import { COLLECTIONS } from "../domain/fields.ts";
import { ROUTES } from "../domain/constants.ts";
import { sendSortedJSON } from "../utilities/json.ts";

const LIST_CLEAR_RESULT = "Lists and items are cleared";
const USERS_CLEAR_RESULT = "Users cleared";
const LIST_GET_DESCRIPTION = "GET doesn't clear lists and items.";
const USERS_GET_DESCRIPTION = "GET doesn't clear users.";

export interface UtilityRouteDependencies {
  database: Db;
}

export const registerUtilityRoutes = (
  app: FastifyInstance,
  dependencies: UtilityRouteDependencies,
): void => {
  const { database } = dependencies;

  app.post(ROUTES.clearListsAndItems, async (_request, reply) => {
    await database.collection(COLLECTIONS.lists).deleteMany({});
    await database.collection(COLLECTIONS.items).deleteMany({});
    return sendSortedJSON(reply, 200, { result: LIST_CLEAR_RESULT });
  });
  app.get(ROUTES.clearListsAndItems, (_request, reply) =>
    reply.code(200).send(LIST_GET_DESCRIPTION));

  app.post(ROUTES.clearUsers, async (_request, reply) => {
    await database.collection(COLLECTIONS.users).deleteMany({});
    return sendSortedJSON(reply, 200, { result: USERS_CLEAR_RESULT });
  });
  app.get(ROUTES.clearUsers, (_request, reply) =>
    reply.code(200).send(USERS_GET_DESCRIPTION));
};
