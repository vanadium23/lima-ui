// Mongo wiring: one client, the svernik database, idempotent boot-time
// indexes (unique email on users, unique token on sessions) mirroring
// src/database/utilities/users_collection.clj.
import { MongoClient, type Db } from "mongodb";
import type { Config } from "./config.ts";
import { COLLECTIONS, DATABASE_NAME } from "./domain/fields.ts";

export interface Database {
  client: MongoClient;
  database: Db;
  close(): Promise<void>;
}

const ensureIndexes = async (database: Db): Promise<void> => {
  await database
    .collection(COLLECTIONS.users)
    .createIndex({ email: 1 }, { unique: true });
  await database
    .collection(COLLECTIONS.sessions)
    .createIndex({ token: 1 }, { unique: true });
};

// Keeping connections short-lived here: the server owns one client for
// its lifetime and closes it on shutdown.
export const connectDatabase = async (config: Config): Promise<Database> => {
  const client = new MongoClient(config.mongoUri);
  await client.connect();
  const database = client.db(DATABASE_NAME);
  await ensureIndexes(database);
  return {
    client,
    database,
    close: async () => {
      await client.close();
    },
  };
};
