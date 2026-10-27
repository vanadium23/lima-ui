// Runtime handles shared between the suite hooks and the step bodies
// (the JVM steps reached MongoDB through mount; here a plain registry).
import type { Db } from "mongodb";

export const runtime: { database: Db | null } = { database: null };

export const activeDatabase = (): Db => {
  if (runtime.database === null) {
    throw new Error("The test database is not connected (hooks did not run).");
  }
  return runtime.database;
};
