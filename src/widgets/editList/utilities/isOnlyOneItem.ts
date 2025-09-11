import type { Item } from "../../../types/types.ts";

export function isOnlyOneItem(items: Item[]) {
  return items.length === 1;
}
