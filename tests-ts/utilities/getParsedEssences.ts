// svernik.sverniks.utilities.get-parsed-item / get-parsed-svernik /
// contains-and-unequal (src/svernik/sverniks/utilities/), ported. The
// JVM donors read MongoDB directly, unscoped by user; here the read
// goes through the src-ts db exports with the test user's id — every
// essence these steps compare is owned by that single test user. The
// donors' get-sorted-* helpers only re-order map keys (Clojure map
// equality is deep and order-independent), so the enrichment —
// exportedTo, the {id, name} originalList, hasExportedItems — is the
// part that must match the API read paths.
import { equalsValue } from "../support/world.ts";
import { activeDatabase } from "../support/runtime.ts";
import {
  findItemDocument,
  findListDocument,
  findReferencingLists,
  findSvernik,
} from "../../src-ts/db/lists.ts";

type Essence = Record<string, unknown>;

// get-parsed-item: find-item with both lookups on — exportedTo
// (excluding the original list) plus the original-list owner.
export const getParsedItem = async (
  itemId: string,
  userId: string,
): Promise<Essence | null> => {
  const database = activeDatabase();
  const item = await findItemDocument(database, itemId, userId);
  if (item === null) {
    return null;
  }
  const originalListId =
    typeof item.originalListId === "string" ? item.originalListId : null;
  const enriched: Essence = {
    ...item,
    exportedTo: await findReferencingLists(database, itemId, originalListId),
  };
  if (originalListId !== null) {
    const owner = await findListDocument(database, originalListId);
    if (owner !== null) {
      enriched.originalList = { id: owner.id, name: owner.name };
    }
  }
  return enriched;
};

// get-parsed-svernik: find-svernik with the exported-to lookup, items
// dereferenced and has-exported-items computed (get-sorted-svernik).
export const getParsedSvernik = async (
  listId: string,
  userId: string,
): Promise<Essence | null> => findSvernik(activeDatabase(), listId, userId);

// contains-keyword-and-not=: an absent key reads back the expected
// value itself (the nil-canary get default), so only a PRESENT key
// holding a different value counts as "contains and not equal".
export const containsKeywordAndNot = (
  someMap: Essence,
  keyword: string,
  value: unknown,
): boolean => {
  const actual = Object.hasOwn(someMap, keyword) ? someMap[keyword] : value;
  return !equalsValue(actual, value);
};
