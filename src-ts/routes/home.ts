// GET / — the greeting route (server.routes/home.clj). Serialization
// goes through the stable writer, so no key ordering can drift.
import type { FastifyInstance } from "fastify";
import { GREETING_FIELD } from "../domain/fields.ts";
import { sendSortedJSON } from "../utilities/json.ts";
import { ROUTES } from "../domain/constants.ts";

export const registerHomeRoutes = (app: FastifyInstance): void => {
  app.get(ROUTES.home, (_request, reply) =>
    sendSortedJSON(reply, 200, {
      [GREETING_FIELD]: "Привет от Лимы!",
    }));
};
