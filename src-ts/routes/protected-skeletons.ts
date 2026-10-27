// Protected list/item route skeletons. The suite walks every route in
// the Clojure route maps; the TS backend reproduces the same path
// surface (same methods!) so the all-routes features see identical
// URLs. Handlers are 501 placeholders except where implemented.
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { attachUser, sendUnauthorized } from "../auth/middleware.ts";
import { ROUTES } from "../domain/constants.ts";
import type { Db } from "mongodb";

export interface ProtectedRouteDependencies {
  database: Db;
  sessionHmacSecret: string;
}

// middleware/protected: auth resolves in preHandler (after body
// parsing, so invalid JSON is a 400 before any auth decision);
// no user → exact 401 body.
export const authPreHandler =
  (dependencies: ProtectedRouteDependencies) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await attachUser(
      dependencies.database,
      dependencies.sessionHmacSecret,
      request,
    );
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
  dependencies: ProtectedRouteDependencies,
): void => {
  const preHandler = authPreHandler(dependencies);

  // POST/HEAD /search/lists is a real route now (routes/sverniks.ts,
  // ET-209); the rest stays here as the not-yet-implemented surface.
  app.route({
    method: ["HEAD"],
    url: ROUTES.items,
    preHandler,
    handler: notImplemented,
  });
  // GET/HEAD /items/:itemId is a real route (routes/items.ts, ET-220);
  // PATCH /items/:itemId is a real route too now (routes/items-update.ts,
  // ET-208) — both keep the auth preHandler contract (items.clj keeps
  // :get/:head/:patch behind middleware/protected).
};
