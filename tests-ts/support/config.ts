// Lima TS BDD harness configuration: mirrors the Clojure harness env
// handling (bin/kaocha sources the repo .env; here dotenv does it) and
// exposes the values both the hooks and the step utilities need.
process.env.NODE_ENV ??= "development";

import dotenv from "dotenv";
dotenv.config();

import { loadConfig } from "../../src-ts/config.ts";

export type TestBackend = "ts" | "clojure";

export const backendSelector = (): TestBackend =>
  process.env.LIMA_TEST_BACKEND === "clojure" ? "clojure" : "ts";

// Steps talk HTTP against SERVER_URL exactly like the JVM steps do
// (utilities.get-local-API-address reads (:server-url env)).
export const serverUrl = (): string =>
  (process.env.SERVER_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const appConfig = loadConfig;

export const TEST_USER_EMAIL = "user@example.com";
export const TEST_USER_PASSWORD = "correctPassword1";
