import { ITEMS_LIMIT } from "../../../../configuration.ts";
import type { DragItem, List } from "../../../types/types.ts";

import { createDefaultItem } from "./createDefaultItem.ts";

export function addAutoItemIfNeeded(listId: List["id"], items: DragItem[]): DragItem[] {
  if (items.length >= ITEMS_LIMIT) {
    return items;
  }

  if (items.length === 0 || items.at(-1)?.content.trim() !== "") {
    return [...items, createDefaultItem(listId, true)];
  }

  return items;
}
