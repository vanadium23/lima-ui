import type { DragItem } from "../../../types/types.ts";
import { storeEditList } from "../editList.store.tsx";

export function insertItemsBeforeAutoListItem(itemsToInsert: DragItem[]): DragItem[] {
  const items = storeEditList.items.filter((item) => !item.auto);
  const existingAutoItem = storeEditList.items.filter((item) => item.auto);

  return [...items, ...itemsToInsert, ...existingAutoItem];
}
