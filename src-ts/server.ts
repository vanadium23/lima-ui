// Fastify bootstrap: env config → mongo → dev users → HTTP server with
// the suite-facing behaviors (HEAD everywhere, lenient JSON parsing,
// 404/405/redirect contracts) and graceful shutdown on SIGTERM/SIGINT.
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { pathToFileURL } from "node:url";
import { loadConfig } from "./config.ts";
import { connectDatabase } from "./db.ts";
import { createListsIndexes } from "./db/indexes.ts";
import { createDevUsers } from "./domain/user.ts";
import { attachUser } from "./auth/middleware.ts";
import { ERRORS, ROUTES } from "./domain/constants.ts";
import {
  ERROR_ID_FIELD,
  ERROR_TEXT_FIELD,
  ERRORS_FIELD,
} from "./domain/fields.ts";
import { registerAuthRoutes } from "./routes/auth.ts";
import { registerHomeRoutes } from "./routes/home.ts";
import { registerItemRoutes } from "./routes/items.ts";
import { registerItemUpdateRoutes } from "./routes/items-update.ts";
import { registerProtectedRouteSkeletons } from "./routes/protected-skeletons.ts";
import { registerSvernikRoutes } from "./routes/sverniks.ts";
import { registerUsersRoutes } from "./routes/users.ts";
import { registerUtilityRoutes } from "./routes/utility.ts";
import type { EmailDependencies } from "./utilities/email-send.ts";
import type { SortedJSON } from "./utilities/json.ts";
import { sendSortedJSON } from "./utilities/json.ts";

const errorsBody = (error: { id: string; text: string }): SortedJSON => ({
  [ERRORS_FIELD]: [
    { [ERROR_ID_FIELD]: error.id, [ERROR_TEXT_FIELD]: error.text },
  ],
});

// Route surface the suite walks; methods mirror the Clojure route
// maps. Fastify answers unmatched methods with 404, so the 405
// contract needs this registry checked in the not-found handler.
export const ROUTE_METHODS: ReadonlyArray<readonly [string, readonly string[]]> = [
  [ROUTES.home, ["GET", "HEAD"]],
  [ROUTES.login, ["POST", "HEAD"]],
  [ROUTES.verifyEmail, ["POST", "HEAD"]],
  [ROUTES.resetPassword, ["POST", "HEAD"]],
  [ROUTES.confirmResetPassword, ["POST", "HEAD"]],
  [ROUTES.users, ["POST", "HEAD"]],
  [ROUTES.profile, ["GET", "HEAD", "PATCH"]],
  [ROUTES.lists, ["GET", "HEAD", "POST"]],
  [ROUTES.list, ["GET", "HEAD", "PATCH", "DELETE"]],
  [ROUTES.searchLists, ["POST", "HEAD"]],
  [ROUTES.countLists, ["GET", "HEAD"]],
  [ROUTES.items, ["HEAD"]],
  [ROUTES.item, ["GET", "HEAD", "PATCH"]],
  [ROUTES.clearListsAndItems, ["GET", "POST"]],
  [ROUTES.clearUsers, ["GET", "POST"]],
];

const segmentsOf = (path: string): string[] => path.split("/").slice(1);

// Exact or parameterized match ("/lists/:listId" matches
// "/lists/list-abc"); the suite uses literal id-shaped segments.
export const routeMatches = (pattern: string, path: string): boolean => {
  const patternSegments = segmentsOf(pattern);
  const pathSegments = segmentsOf(path);
  return (
    patternSegments.length === pathSegments.length &&
    patternSegments.every(
      (segment, index) =>
        segment.startsWith(":") || segment === pathSegments[index],
    )
  );
};

export const buildApp = (options: {
  database: Awaited<ReturnType<typeof connectDatabase>>;
  sessionHmacSecret: string;
  serverUrl: string;
  email: EmailDependencies;
}): FastifyInstance => {
  const app = Fastify({ logger: false, caseSensitive: true });
  // The Clojure stack treats any body as JSON (content-type is added
  // when missing, decode errors become 400); a single lenient parser
  // replicates that for every content type.
  app.removeAllContentTypeParsers();
  app.addContentTypeParser(
    "*",
    { parseAs: "buffer" },
    (_request, body, done) => {
      const raw = (body as Buffer).toString("utf8");
      if (raw.length === 0) {
        done(null, undefined);
        return;
      }
      try {
        done(null, JSON.parse(raw) as unknown);
      } catch {
        done(Object.assign(new Error("invalid JSON"), { statusCode: 400 }));
      }
    },
  );

  const dependencies = {
    database: options.database.database,
    sessionHmacSecret: options.sessionHmacSecret,
  };

  registerHomeRoutes(app);
  const emailDependencies: EmailDependencies = {
    smtpHost: options.email.smtpHost,
    smtpPort: options.email.smtpPort,
    smtpFrom: options.email.smtpFrom,
    clientAddress: options.email.clientAddress,
  };
  registerAuthRoutes(app, {
    ...dependencies,
    email: emailDependencies,
  });
  registerUsersRoutes(app, {
    ...dependencies,
    email: emailDependencies,
  });
  registerProtectedRouteSkeletons(app, dependencies);
  registerItemRoutes(app, dependencies);
  registerItemUpdateRoutes(app, dependencies);
  registerSvernikRoutes(app, { ...dependencies, serverUrl: options.serverUrl });
  registerUtilityRoutes(app, dependencies);

  // reitit's redirect-trailing-slash-handler runs above auth for
  // every URL, so the redirect happens in the earliest hook, before
  // routing and auth; the query string is preserved.
  app.addHook("onRequest", async (request, reply) => {
    const rawUrl = request.raw.url ?? "/";
    const pathOnly = rawUrl.split("?")[0] ?? "/";
    if (pathOnly !== ROUTES.home && pathOnly.endsWith("/")) {
      const slashless = pathOnly.replace(/\/+$/, "");
      reply
        // 308 Permanent Redirect: reitit's redirect-trailing-slash-
        // handler keeps the method (clj-http follows nothing for PATCH;
        // the suite asserts PERMANENT_REDIRECT = 308).
        .code(308)
        .header("location", `${slashless}${rawUrl.slice(pathOnly.length)}`)
        .send();
    }
  });

  // Authentication is resolved globally (wrap-user-authentication)
  // in preHandler — after content parsing, matching the Clojure
  // wrap-formats-before-auth order, so invalid JSON is a 400 before
  // any auth decision. Protected routes enforce it in their own
  // preHandler hooks.
  app.addHook("preHandler", async (request) => {
    await attachUser(dependencies.database, options.sessionHmacSecret, request);
  });

  app.setNotFoundHandler((request, reply) => {
    const rawUrl = request.raw.url ?? "/";
    const pathOnly = rawUrl.split("?")[0] ?? "/";
    const route = ROUTE_METHODS.find(([pattern]) =>
      routeMatches(pattern, pathOnly),
    );
    if (route !== undefined && !route[1].includes(request.method)) {
      sendSortedJSON(reply, 405, errorsBody(ERRORS.methodNotAllowed));
      return;
    }
    sendSortedJSON(reply, 404, errorsBody(ERRORS.resourceNotFound));
  });

  app.setErrorHandler((error: NodeJS.ErrnoException & { statusCode?: number }, _request, reply) => {
    if (error.statusCode === 400) {
      sendSortedJSON(reply, 400, errorsBody(ERRORS.invalidJSON));
      return;
    }
    sendSortedJSON(reply, 500, errorsBody(ERRORS.generalSvernik));
  });

  return app;
};

export const startServer = async (): Promise<void> => {
  const handle = await bootstrapBackend();
  const { app } = handle;

  let shuttingDown = false;
  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    process.stdout.write(`Received ${signal}, shutting down.\n`);
    try {
      await app.close();
      await handle.close();
      process.exit(0);
    } catch (error) {
      process.stderr.write(`Shutdown error: ${String(error)}\n`);
      process.exit(1);
    }
  };
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
  process.once("SIGINT", () => void shutdown("SIGINT"));
};

// Shared boot path (env → mongo → indexes → dev users → listening app):
// server.ts (pure API, the BDD contract) and server-app.ts (API + the
// hosted Astro UI in one process) both start through it.
export interface BackendHandle {
  app: FastifyInstance;
  config: ReturnType<typeof loadConfig>;
  close: () => Promise<void>;
}

export const bootstrapBackend = async (): Promise<BackendHandle> => {
  process.env.NODE_ENV ??= "development";
  const dotenv = await import("dotenv");
  dotenv.config();
  const config = loadConfig();
  const database = await connectDatabase(config);
  // lists-full-text-index (sverniks_collection.clj): the {name: "text"}
  // index must exist before the first /search/lists $text query.
  await createListsIndexes(database.database);
  // The server seeds the dev accounts only when DEV=true (the
  // standalone bin/dev-users.ts entry point creates them on demand).
  if (config.dev) {
    await createDevUsers(database.database);
  }

  const app = buildApp({
    database,
    sessionHmacSecret: config.sessionHmacSecret,
    serverUrl: config.serverUrl,
    email: {
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpFrom: config.smtpFrom,
      clientAddress: config.clientAddress,
    },
  });
  await app.listen({ port: config.port, host: "0.0.0.0" });
  process.stdout.write(`Lima TS backend listening on :${config.port}\n`);

  return {
    app,
    config,
    close: async () => {
      await database.close();
    },
  };
};

// Entry point: tsx runs this file directly; start unless imported as a module.
const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  startServer().catch((error: unknown) => {
    process.stderr.write(`Fatal startup error: ${String(error)}\n`);
    process.exit(1);
  });
}
