// Protected list/item route skeletons. The suite walks every route in
// the Clojure route maps; the TS backend reproduces the same path
// surface (same methods!) so the all-routes features see identical
// URLs. Handlers are 501 placeholders except where implemented.
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { sendUnauthorized } from "../auth/middleware.ts";
import { ROUTES } from "../domain/constants.ts";
import type { Db } from "mongodb";

export interface ProtectedRouteDependencies {
  database: Db;
  sessionHmacSecret: string;
}

// middleware/protected: the session is resolved ONCE per request by the
// application-level preHandler (buildApp — after body parsing, so
// invalid JSON is a 400 before any auth decision); a protected route
// only turns a missing user into the exact 401 body. Resolving it again
// here doubled the session + user lookups of every protected request.
export const authPreHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  if (request.user === null) {
    sendUnauthorized(reply);
  }
};

const notImplemented = (
  _request: FastifyRequest,
  reply: FastifyReply,
): void => {
  reply.code(501).send();
};

export const registerProtectedRouteSkeletons = (
  app: FastifyInstance,
): void => {
  app.route({
    method: ["HEAD"],
    url: ROUTES.items,
    preHandler: authPreHandler,
    handler: notImplemented,
  });
  // GET/HEAD /items/:itemId is a real route (routes/items.ts, ET-220);
  // PATCH /items/:itemId is a real route too now (routes/items-update.ts,
  // ET-208) — both keep the auth preHandler contract (items.clj keeps
  // :get/:head/:patch behind middleware/protected).
};
