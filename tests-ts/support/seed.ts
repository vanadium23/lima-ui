// Database preparation, ported from env/dev/clj/tests/kaocha_hooks.clj
// + prepare-*-test-data.clj. Same order as the JVM hooks: drop users
// BEFORE boot (the backend reseeds its own dev users with its password
// hashing scheme), then after readiness clean items/lists/sessions and
// seed the shared test data through the src-ts write path (insertList /
// essenceToDocument — raw insertOne leaks ObjectIds into the API).
import type { Db } from "mongodb";

import { connectDatabase, type Database } from "../../src-ts/db.ts";
import { COLLECTIONS } from "../../src-ts/domain/fields.ts";
import {
  buildSvernik,
  createItemFromValidData,
} from "../../src-ts/domain/svernik-build.ts";
import {
  essenceToDocument,
  insertList,
} from "../../src-ts/db/lists.ts";
import { loadConfig } from "../../src-ts/config.ts";
import { serverUrl } from "./config.ts";
import { request } from "./http.ts";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./config.ts";

// tests.prepare-test-utils/get-user-id: login over HTTP, then read the
// profile — works identically against both backends.
export const getUserId = async (): Promise<string> => {
  const login = await request("POST", `${serverUrl()}/auth/login`, {
    body: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
  });
  const token = (login.body as { token?: string } | null)?.token;
  if (token === undefined) {
    throw new Error(`Cannot login as the test user: HTTP ${login.status}.`);
  }
  const profile = await request("GET", `${serverUrl()}/users/me`, { token });
  const id = (profile.body as { id?: string } | null)?.id;
  if (id === undefined) {
    throw new Error(`Cannot read the test user profile: HTTP ${profile.status}.`);
  }
  return id;
};

// prepare-items-test-data items-data, byte-for-byte.
const itemsData = [
  {
    id: "item-ordinary",
    type: "item",
    URL: "https://app.svernik.com/terbiy/items/item-ordinary",
    content: "Read candidate's CV",
    purpose: "To be aware of candidate.",
    reasonForLatestUpdate: "Fixed a typo.",
    note: "It's better to download resume on computer to prevent stretching by browser.",
  },
  {
    id: "item-with-no-purpose",
    type: "item",
    URL: "https://app.svernik.com/terbiy/items/item-with-no-purpose",
    content: "Toothbrush",
    purpose: "",
    reasonForLatestUpdate: "Removed brand.",
    note: "It's better to have electronic one.",
  },
  {
    id: "item-without-note",
    type: "item",
    URL: "https://app.svernik.com/terbiy/items/item-without-note",
    content: "Toothpaste",
    purpose: "To keep teeth clean.",
    reasonForLatestUpdate: "Fixed typo.",
    note: "",
  },
  {
    id: "item-with-no-documented-reason-for-latest-update",
    type: "item",
    URL: "https://app.svernik.com/terbiy/items/item-with-no-documented-reason-for-latest-update",
    content: "Dental floss",
    purpose: "To remove food leftovers from places not reachable by the toothbrush.",
    reasonForLatestUpdate: "",
    note: "Ensure it's enough it before taking with you.",
  },
  {
    id: "item-fully-fledged",
    type: "item",
    URL: "https://app.svernik.com/terbiy/items/item-fully-fledged",
    content: "Sunscreen 50",
    purpose: "Not to get burned.",
    reasonForLatestUpdate: "Added 50 because what's lower doesn't make sense for me.",
    note: "Some hotels provide their own sun protection, it's better to check before the journey.",
  },
] as const;

const listRoute = (id: string): string => `${serverUrl()}/lists/${id}`;

// prepare-lists-test-data lists-data, byte-for-byte (URLs through the
// local API route like the donor does).
const listsData = [
  {
    id: "list-ordinary",
    type: "list",
    name: "Interview",
    URL: listRoute("list-ordinary"),
    items: [{ id: "item-ordinary" }],
    note: "I would recommend using this checklist for juniors and middles.",
    purpose: "To support candidates interviewing process",
    reasonForLatestUpdate: "We decided to ask Europe-based interviewees a question about their learning sources.",
    noDocumentedReasonForLatestUpdate: false,
  },
  {
    id: "list-test-1",
    type: "list",
    name: "Retrospective",
    URL: listRoute("list-test-1"),
    items: [{ id: "item-ordinary" }],
    note: "",
    purpose: "To provide a small retrospective framework",
    reasonForLatestUpdate: "",
    noDocumentedReasonForLatestUpdate: true,
  },
  {
    id: "list-test-2",
    type: "list",
    name: "Vacation",
    URL: listRoute("list-test-2"),
    items: [{ id: "item-ordinary" }],
    note: "We should automate the majority of the steps in here somehow.",
    purpose: "To navigate to vacation smoothly",
    reasonForLatestUpdate: "",
    noDocumentedReasonForLatestUpdate: true,
  },
  {
    id: "list-with-no-purpose",
    type: "list",
    name: "Project Onboarding",
    URL: listRoute("list-with-no-purpose"),
    items: [{ id: "item-ordinary" }],
    note: "It would be great to push this checklist to just created Jira issue automatically.",
    purpose: "",
    reasonForLatestUpdate: "It turned out that the incoming team leaders do not know how to settle statistics gathering properly.",
    noDocumentedReasonForLatestUpdate: false,
  },
  {
    id: "list-without-note",
    type: "list",
    name: "Book Reading",
    URL: listRoute("list-without-note"),
    items: [{ id: "item-ordinary" }],
    purpose: "Simply reading a book is not enough to get the most from it.",
    reasonForLatestUpdate: "After adding the regular overview of all books tasks it is no longer relevant to plan these activities for a single book.",
    noDocumentedReasonForLatestUpdate: false,
    note: "",
  },
  {
    id: "list-for-search",
    type: "list",
    name: "Article Reading",
    URL: listRoute("list-for-search"),
    items: [{ id: "item-ordinary" }, { id: "item-with-no-documented-reason-for-latest-update" }],
    purpose: "Simply reading a article is not enough to get the most from it.",
    reasonForLatestUpdate: "After adding the regular overview of all articles tasks it is no longer relevant to plan these activities for a single book.",
    noDocumentedReasonForLatestUpdate: false,
    note: "",
  },
  {
    id: "list-with-no-documented-reason-for-latest-update",
    type: "list",
    name: "Gathering for a Short Trip",
    URL: listRoute("list-with-no-documented-reason-for-latest-update"),
    purpose: "To help not to forget all the necessary items.",
    items: [{ id: "item-with-no-purpose" }, { id: "item-without-note" }],
    reasonForLatestUpdate: "",
    noDocumentedReasonForLatestUpdate: true,
    note: "This list has a low variability due to the shortness of the trip.",
  },
  {
    id: "list-with-sublist",
    type: "list",
    URL: listRoute("list-with-sublist"),
    name: "Gathering for a Summer Vacation",
    purpose: "To help not to forget significant amount of items required for a vacation",
    items: [{ id: "list-with-no-documented-reason-for-latest-update" }, { id: "item-fully-fledged" }],
    reasonForLatestUpdate: "Linked the Gathering for a Short Trip list as all items from there are required in here.",
    noDocumentedReasonForLatestUpdate: false,
    note: "This list is one from a series of alike ones",
  },
] as const;

const prepareItemsTestData = async (database: Db, userId: string): Promise<void> => {
  for (const itemData of itemsData) {
    const { id: itemId, ...item } = itemData;
    // link-essence-or-create-item-from-valid-data with a nil list-id,
    // then the explicit item-data overrides id/version-id/user-id.
    const built = createItemFromValidData(
      item as never,
      null as never,
      serverUrl(),
      userId,
    );
    const merged = {
      ...built,
      ...item,
      id: itemId,
      versionId: itemId,
      userId,
    };
    await database
      .collection(COLLECTIONS.items)
      .insertOne(essenceToDocument(merged) as never);
  }
};

const prepareListsTestData = async (
  database: Db,
  userId: string,
): Promise<void> => {
  for (const listData of listsData) {
    const {
      id,
      reasonForLatestUpdate,
      noDocumentedReasonForLatestUpdate,
      ...rawData
    } = listData;
    const built = await buildSvernik(
      rawData as never,
      userId,
      serverUrl(),
      database,
      {},
    );
    const list = {
      ...built,
      ...rawData,
      items: built.items,
      id,
      versionId: id,
      userId,
      reasonForLatestUpdate,
      noDocumentedReasonForLatestUpdate,
    };
    await insertList(database, list as never);
  }
};

// attach-original-list-to-items: for every most-recent item without an
// original list, the earliest-created most-recent list referencing it
// becomes its original list (all versions of the item are updated).
const attachOriginalListToItems = async (database: Db): Promise<void> => {
  const items = await database
    .collection(COLLECTIONS.items)
    .find({ originalListId: null, newerVersionId: null })
    .toArray();
  for (const item of items) {
    const originalList = await database
      .collection(COLLECTIONS.lists)
      .find({ items: item.id, newerVersionId: null })
      .sort({ createdAt: 1 })
      .limit(1)
      .next();
    if (originalList !== null) {
      await database
        .collection(COLLECTIONS.items)
        .updateMany({ id: item.id }, { $set: { originalListId: originalList.id } });
    }
  }
};

export const prepareDatabase = async (): Promise<Database> => {
  const database = await connectDatabase(loadConfig());
  // Drop BEFORE boot: the backend reseeds the dev users with its own
  // password hashes, and login is the readiness probe.
  await database.database.collection(COLLECTIONS.users).deleteMany({});
  return database;
};

export const cleanAndSeedAfterBackendReady = async (database: Db): Promise<void> => {
  await database.collection(COLLECTIONS.items).deleteMany({});
  await database.collection(COLLECTIONS.lists).deleteMany({});
  await database.collection(COLLECTIONS.sessions).deleteMany({});
  const userId = await getUserId();
  await prepareItemsTestData(database, userId);
  await prepareListsTestData(database, userId);
  await attachOriginalListToItems(database);
};
