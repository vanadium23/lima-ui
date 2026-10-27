// External backend process management, ported from
// env/dev/clj/tests/kaocha_hooks.clj: spawn bin/run-backend-for-tests
// with the repo .env in the environment, treat "test user can log in"
// as readiness, and kill the whole process tree afterwards.
import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync, openSync } from "node:fs";
import process from "node:process";

import { request } from "./http.ts";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD, backendSelector, serverUrl } from "./config.ts";

const TEST_BACKEND_SCRIPT = "bin/run-backend-for-tests";
export const TEST_BACKEND_LOG = "target/test-backend.log";
const BACKEND_READY_TIMEOUT_SECONDS = 120;
const BACKEND_READY_PROBE_PERIOD_MS = 1000;
const BACKEND_STOP_TIMEOUT_MS = 10_000;
const HTTP_OK = 200;

let backend: ChildProcess | null = null;

const loginProbe = async (): Promise<number | null> => {
  try {
    const response = await request("POST", `${serverUrl()}/auth/login`, {
      body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
      followRedirects: true,
    });
    return response.status;
  } catch {
    return null;
  }
};

export const startBackend = async (): Promise<void> => {
  mkdirSync("target", { recursive: true });
  const logDescriptor = openSync(TEST_BACKEND_LOG, "w");
  // detached: own process group, so kill(-pid) reaches lein's java child
  // (or tsx) exactly like the JVM hooks killed the descendant tree.
  backend = spawn(TEST_BACKEND_SCRIPT, [backendSelector()], {
    detached: true,
    stdio: ["ignore", logDescriptor, logDescriptor],
    env: process.env,
  });
  backend.on("exit", () => undefined);

  const deadline = Date.now() + BACKEND_READY_TIMEOUT_SECONDS * 1000;
  for (;;) {
    if (backend.exitCode !== null) {
      throw new Error(
        `The external test backend exited before becoming ready (code ${backend.exitCode}), see ${TEST_BACKEND_LOG}.`,
      );
    }
    if ((await loginProbe()) === HTTP_OK) {
      return;
    }
    if (Date.now() > deadline) {
      await stopBackend();
      throw new Error(
        `The external test backend did not become ready within ${BACKEND_READY_TIMEOUT_SECONDS} seconds, see ${TEST_BACKEND_LOG}.`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, BACKEND_READY_PROBE_PERIOD_MS));
  }
};

export const stopBackend = async (): Promise<void> => {
  if (backend === null || backend.pid === undefined) {
    return;
  }
  try {
    process.kill(-backend.pid, "SIGTERM");
  } catch {
    // Already gone.
  }
  const deadline = Date.now() + BACKEND_STOP_TIMEOUT_MS;
  while (backend.exitCode === null && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (backend.exitCode === null) {
    try {
      process.kill(-backend.pid, "SIGKILL");
    } catch {
      // Already gone.
    }
  }
  backend = null;
};
