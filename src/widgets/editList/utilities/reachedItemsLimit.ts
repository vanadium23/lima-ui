import { ITEMS_LIMIT } from "../../../../configuration.ts";
import { storeEditList } from "../editList.store.tsx";

export function reachedItemsLimit() {
  const itemsButAuto = storeEditList.items.filter((item) => !item.auto);

  return itemsButAuto.length >= ITEMS_LIMIT;
}
