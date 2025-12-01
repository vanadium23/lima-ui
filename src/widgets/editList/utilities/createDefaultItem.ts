import type { EditListItem, ListId, ListName } from "../../../types/types.ts";

export function createDefaultItem(listId: ListId = "", listName: ListName = "", auto: boolean = false): EditListItem {
  return {
    type: "item",
    content: "",
    id: "",
    originalList: { id: listId, name: listName },
    dragId: createDragId(),
    auto,
  };
}

export function createDragId() {
  return (Math.random() * 1000000).toString();
}
