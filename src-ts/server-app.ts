// Single-process Lima application: the API server (frozen BDD contract,
// exactly what src-ts/server.ts boots) plus the built Astro UI hosted by
// a plain node:http listener. Dockerfile.app runs this file so one
// container serves everything:
//
//   :PORT    (3000) — the Lima API, untouched (cucumber runs against it);
//   :UI_PORT (4321) — the Astro UI (pages + /api/* endpoints). The UI's
//                     server-side fetches use SERVER_API_URL, baked at
//                     build time as http://127.0.0.1:3000 — same process.
//
// Two listeners are deliberate: GET /lists is BOTH a frozen API route
// (JSON) and the "my lists" page (HTML), so the UI cannot share the API
// port. The UI listener is a raw http server — NOT fastify: fastify's
// body parsing consumes the request stream, and the Astro middleware
// ("Response body object should not be disturbed or locked") then
// cannot rebuild its WebAPI Request from it. Raw req/res pass through
// untouched; existing files from dist/client are served first.
import type { IncomingMessage, ServerResponse } from "node:http";
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

// Exact files from the Astro client build (/_astro assets, favicon…).
// Missing paths fall through to the Astro handler.
const serveStaticFile = async (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<boolean> => {
  const pathname = decodeURIComponent(
    (request.url ?? "/").split("?")[0] ?? "/",
  );
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
  const backend: BackendHandle = await bootstrapBackend();
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
  process.stdout.write(`Lima UI (Astro) listening on :${uiPort}\n`);

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
