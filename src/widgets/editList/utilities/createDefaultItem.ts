import type { EditListElement, ItemContent, ListId, ListName } from "../../../types/types.ts";

export function createDefaultElement(
  listId: ListId = "",
  listName: ListName = "",
  itemContent: ItemContent = "",
  auto: boolean = false,
): EditListElement {
  return {
    id: "",
    originalList: { id: listId, name: listName },
    items: [{ id: "", content: itemContent }],
    isImported: false,
    exportedTo: [],
    dragId: createDragId(),
    auto,
  };
}

export function createDragId() {
  return (Math.random() * 1000000).toString();
}
