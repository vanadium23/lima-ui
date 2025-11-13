import type { DragItem, List } from "../../../types/types.ts";

export function createDefaultItem(
  listId: List["id"] = "",
  listName: List["name"] = "",
  auto: boolean = false,
): DragItem {
  return { content: "", id: "", originalList: { id: listId, name: listName }, dragId: createDragId(), auto };
}

export function createDragId() {
  return (Math.random() * 1000000).toString();
}
