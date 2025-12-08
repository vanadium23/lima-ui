import type { EditListElement, ListId, ListName } from "../../../types/types.ts";

export function createDefaultElement(
  listId: ListId = "",
  listName: ListName = "",
  auto: boolean = false,
): EditListElement {
  return {
    id: "",
    originalList: { id: listId, name: listName },
    items: [{ id: "", content: "", exportedTo: [] }],
    isImported: false,
    exportedTo: [],
    dragId: createDragId(),
    auto,
  };
}

export function createDragId() {
  return (Math.random() * 1000000).toString();
}
