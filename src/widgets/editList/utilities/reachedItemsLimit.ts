import { ITEMS_LIMIT } from "../../../../configuration.ts";

import { getEditListElementsWithoutAutoItem } from "./getEditListElementsWithoutAutoItem.ts";

export function reachedItemsLimit() {
  return getEditListElementsWithoutAutoItem().length >= ITEMS_LIMIT;
}
