// Single-port Lima application (contract v2): ONE public listener serves
// everything — the UI (pages, static assets, the /api/session cookie
// gateway) and the real API under /api/*, which is proxied to the API
// fastify instance listening internally (127.0.0.1:PORT). Dockerfile.app
// runs this file, so the container exposes a single port.
//
//   public :UI_PORT (4321) — everything:
//     /api/* (minus /api/session) → internal API fastify;
//     everything else (/, /lists pages, /api/session, /_astro assets)
//     → static files from dist/client or the Astro middleware handler.
//
// The internal listener is a deliberate implementation detail: it keeps
// the API lifecycle (fastify body parsing, the frozen contract
// handlers) untouched while the public surface is one origin. The raw
// node:http listener exists because fastify's body parsing would break
// the Astro middleware (see the history of this file).
import type { IncomingMessage, ServerResponse } from "node:http";
import { request as httpRequest } from "node:http";
import { createServer } from "node:http";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { bootstrapBackend, type BackendHandle } from "./server.ts";

const DEFAULT_UI_PORT = 4321;

const distDir = path.join(import.meta.dirname ?? ".", "..", "dist");
const entryPath = path.join(distDir, "server", "entry.mjs");
const clientDir = path.join(distDir, "client");

type AstroHandler = (
  request: IncomingMessage,
  response: ServerResponse,
) => void | Promise<void>;

const MIME_TYPES: Readonly<Record<string, string>> = {
  ".css": "text/css",
  ".ico": "image/x-icon",
  ".js": "text/javascript",
  ".json": "application/json",
  ".mjs": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

const pathOnlyOf = (request: IncomingMessage): string =>
  (request.url ?? "/").split("?")[0] ?? "/";

// Public /api surface: ALL of /api is the API, like on :3000 and like
// the vite dev proxy (astro.config.mjs) — the backend answers unknown
// routes and methods with its JSON 404/405. Routing only the frozen
// registry let e.g. DELETE /api/lists fall through to Astro, whose
// origin check answered 403 text/plain and whose 404 is HTML. The one
// exception is /api/session, the UI cookie gateway served by Astro.
const isSessionGateway = (pathOnly: string): boolean =>
  pathOnly === "/api/session" || pathOnly === "/api/session/";

const isApiRequest = (request: IncomingMessage): boolean => {
  const pathOnly = pathOnlyOf(request);
  return (
    (pathOnly === "/api" || pathOnly.startsWith("/api/")) &&
    !isSessionGateway(pathOnly)
  );
};

const proxyToApi = (
  request: IncomingMessage,
  response: ServerResponse,
  apiPort: number,
): void => {
  const headers = { ...request.headers };
  delete headers.host;
  delete headers.connection;
  // The backend trusts X-Forwarded-For only behind this proxy
  // (trustProxy in server-app mode), and the header is SET here from
  // the socket — whatever the client sent is dropped — so the ip stored
  // with a session is the real client's and cannot be chosen by it.
  if (request.socket.remoteAddress !== undefined) {
    headers["x-forwarded-for"] = request.socket.remoteAddress;
  } else {
    delete headers["x-forwarded-for"];
  }
  const upstream = httpRequest(
    {
      host: "127.0.0.1",
      port: apiPort,
      method: request.method,
      path: request.url,
      headers,
    },
    (upstreamResponse) => {
      response.writeHead(
        upstreamResponse.statusCode ?? 502,
        upstreamResponse.headers,
      );
      upstreamResponse.pipe(response);
    },
  );
  upstream.on("error", (error) => {
    if (!response.headersSent) {
      response.writeHead(502, { "content-type": "text/plain" });
    }
    response.end(`API proxy error: ${String(error)}`);
  });
  request.pipe(upstream);
};

// Exact files from the Astro client build (/_astro assets, favicon…).
// Missing paths fall through to the Astro handler.
const serveStaticFile = async (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<boolean> => {
  const pathname = decodeURIComponent(pathOnlyOf(request));
  const filePath = path.normalize(path.join(clientDir, pathname));
  if (!filePath.startsWith(clientDir)) {
    return false;
  }
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    return false;
  }
  const body = await readFile(filePath);
  response.writeHead(200, {
    "content-type": MIME_TYPES[path.extname(filePath)] ?? "application/octet-stream",
    "content-length": body.byteLength,
  });
  response.end(body);
  return true;
};

export const startAppServer = async (): Promise<void> => {
  if (!existsSync(entryPath)) {
    throw new Error(
      `${entryPath} not found — build the UI first: ` +
        "ASTRO_ADAPTER_MODE=middleware npm run build",
    );
  }
  // The API is reachable only through this process (the proxy sets the
  // client ip itself), so it may trust X-Forwarded-For.
  const backend: BackendHandle = await bootstrapBackend({ trustProxy: true });
  // The built UI endpoints read process.env.SERVER_API_URL at runtime
  // (vite turns import.meta.env.SERVER_API_URL into it in the SSR
  // bundle): point them at the API listener of this very process.
  process.env.SERVER_API_URL ??= `http://127.0.0.1:${backend.config.port}`;

  const entry = (await import(pathToFileURL(entryPath).href)) as {
    handler?: AstroHandler;
    default?: AstroHandler;
  };
  const handler = entry.handler ?? entry.default;
  if (typeof handler !== "function") {
    throw new Error(
      `Unexpected Astro middleware build exports: ${Object.keys(entry).join(", ")}`,
    );
  }

  const uiPort = Number(process.env.UI_PORT ?? DEFAULT_UI_PORT);
  const ui = createServer((request, response) => {
    void (async () => {
      try {
        if (isApiRequest(request)) {
          proxyToApi(request, response, backend.config.port);
          return;
        }
        if (await serveStaticFile(request, response)) {
          return;
        }
        await handler(request, response);
      } catch (error) {
        if (!response.headersSent) {
          response.statusCode = 500;
        }
        response.end(`UI server error: ${String(error)}`);
      }
    })();
  });
  await new Promise<void>((resolve, reject) => {
    ui.once("error", reject);
    ui.listen(uiPort, "0.0.0.0", () => resolve());
  });
  process.stdout.write(
    `Lima app listening on :${uiPort} (API proxied internally on :${backend.config.port})\n`,
  );

  let shuttingDown = false;
  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    process.stdout.write(`Received ${signal}, shutting down.\n`);
    try {
      ui.close();
      await backend.app.close();
      await backend.close();
      process.exit(0);
    } catch (error) {
      process.stderr.write(`Shutdown error: ${String(error)}\n`);
      process.exit(1);
    }
  };
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
  process.once("SIGINT", () => void shutdown("SIGINT"));
};

// Entry point: tsx runs this file directly; start unless imported as a module.
const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  startAppServer().catch((error: unknown) => {
    process.stderr.write(`Fatal startup error: ${String(error)}\n`);
    process.exit(1);
  });
}
