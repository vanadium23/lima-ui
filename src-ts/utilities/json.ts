// Handlers return plain data; server.ts serializes with sorted keys so
// the JSON matches the Clojure output ordering checked by the suite's
// properly-sorted-JSON utility. Two orderings coexist:
//  - alphabetical (errors bodies: {errors: [{id, text}]} — the
//    Clojure error maps are sorted by [id, text] which equals
//    alphabetical here);
//  - domain-order (essences: svernik/item/linked-list maps follow the
//    keywords-order vectors via get-map-sorted-by-order, NOT the
//    alphabet).
import type { FastifyReply } from "fastify";
import {
  ERROR_KEYWORDS_ORDER,
  ERRORS_KEYWORDS_ORDER,
  ITEM_KEYWORDS_ORDER,
  LINKED_LIST_KEYWORDS_ORDER,
  SVERNIK_KEYWORDS_ORDER,
} from "../domain/svernik.ts";

export type SortedJSON = number | string | boolean | null | SortedJSONMap |
  SortedJSON[];
export type SortedJSONMap = { [key: string]: SortedJSON };

const compareByOrder = (order: readonly string[]) => {
  const indexOf = new Map(order.map((key, index) => [key, index]));
  return (a: string, b: string): number => {
    const aIndex = indexOf.get(a) ?? order.length;
    const bIndex = indexOf.get(b) ?? order.length;
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    return a < b ? -1 : a > b ? 1 : 0;
  };
};

// Alphabetical stringify: existing behavior for simple bodies.
export const stableStringify = (value: SortedJSON): string => {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const body = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key]!)}`)
      .join(",");
    return `{${body}}`;
  }
  return JSON.stringify(value);
};

// Essence stringify: every OBJECT is checked against each domain order
// (linked-list, item, svernik, error) and sorted by the FIRST order
// that contains most of its keys — the Clojure backend sorts each map
// by ITS OWN keywords order (a linked list {id, name} sorts by
// [id, name], an item by item-keywords-order, a svernik by
// svernik-keywords-order). Objects matching no order keep insertion
// order. Arrays recurse with the same logic.
const ESSENCE_ORDERS = [
  LINKED_LIST_KEYWORDS_ORDER,
  ITEM_KEYWORDS_ORDER,
  SVERNIK_KEYWORDS_ORDER,
  ERROR_KEYWORDS_ORDER,
];

const pickOrder = (keys: string[]): readonly string[] | null => {
  let best: readonly string[] | null = null;
  let bestHits = 0;
  for (const order of ESSENCE_ORDERS) {
    const known = order as readonly string[];
    const hits = keys.filter((key) => known.includes(key)).length;
    if (hits > bestHits) {
      best = known;
      bestHits = hits;
    }
  }
  return bestHits > 1 ? best : null;
};

const essenceStringify = (value: SortedJSON): string => {
  if (Array.isArray(value)) {
    return `[${value.map(essenceStringify).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value);
    const order = pickOrder(keys);
    const body = (order === null ? keys : keys.sort(compareByOrder(order)))
      .map((key) => `${JSON.stringify(key)}:${essenceStringify(value[key]!)}`)
      .join(",");
    return `{${body}}`;
  }
  return JSON.stringify(value);
};

export const sendSortedJSON = (
  reply: FastifyReply,
  statusCode: number,
  payload: SortedJSON,
): FastifyReply => reply
  .code(statusCode)
  .header("content-type", "application/json; charset=utf-8")
  .send(stableStringify(payload));

export const sendEssenceJSON = (
  reply: FastifyReply,
  statusCode: number,
  payload: SortedJSON,
): FastifyReply => reply
  .code(statusCode)
  .header("content-type", "application/json; charset=utf-8")
  .send(essenceStringify(payload));
