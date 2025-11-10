import { ITEMS_LIMIT } from "../../../../configuration.ts";
import { storeEditList } from "../editList.store.tsx";

export function reachedItemsLimit() {
  const hasAutoItem = storeEditList.items.some((item) => item.auto);
  const regularItemsCount = hasAutoItem ? storeEditList.items.length - 1 : storeEditList.items.length;

  return regularItemsCount >= ITEMS_LIMIT;
}
