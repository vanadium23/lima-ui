import type { DragItem, List } from "../../../types/types.ts";

export function createDefaultItem(listId: List["id"] = "", auto: boolean = false): DragItem {
  return { content: "", id: "", originalListId: listId, dragId: createDragId(), auto };
}

export function createDragId() {
  return (Math.random() * 1000000).toString();
}
