import { ITEMS_LIMIT } from "../../../../configuration.ts";
import { storeEditList } from "../editList.store.tsx";

export function reachedItemsLimit() {
  return storeEditList.items.filter((item) => !item.auto).length >= ITEMS_LIMIT;
}
