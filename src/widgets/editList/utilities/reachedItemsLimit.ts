import { ITEMS_LIMIT } from "../../../../configuration.ts";

import { getEditListElementsWithoutAutoItem } from "./getEditListElementsWithoutAutoItem.tsx";

export function reachedItemsLimit() {
  return getEditListElementsWithoutAutoItem().length >= ITEMS_LIMIT;
}
