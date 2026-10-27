// Suite lifecycle, ported from tests.edn kaocha hooks. The whole run
// shares one backend process and one seeded database — scenarios
// accumulate data, which is why absolute counts (but not scenario
// outcomes) float exactly like they do under kaocha.
import type { Database } from "../../src-ts/db.ts";
import { startBackend, stopBackend } from "./backend.ts";
import { cleanAndSeedAfterBackendReady, prepareDatabase } from "./seed.ts";
import { runtime } from "./runtime.ts";
import { AfterAll, BeforeAll } from "./world.ts";

let database: Database | null = null;

BeforeAll(async () => {
  database = await prepareDatabase();
  runtime.database = database.database;
  console.log("Starting the external Lima backend for cucumber-js testing.");
  await startBackend();
  console.log("External backend is ready; cleaning and seeding the database.");
  await cleanAndSeedAfterBackendReady(database.database);
  console.log("Starting Cucumber testing.");
});

AfterAll(async () => {
  await stopBackend();
  runtime.database = null;
  await database?.close();
  database = null;
});
