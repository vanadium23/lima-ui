import type {
  EditListElement,
  EditListSimpleItem,
  EditListType,
  ItemContent,
  ItemId,
  ListElementFromBackend,
  ListId,
} from "../../../types/types.ts";

import { createDragId } from "./createDefaultItem.ts";

export function convertElementsFromBackendToEditListElements(
  elementsFromBackend: ListElementFromBackend[],
  listId: ListId,
): EditListElement[] {
  return elementsFromBackend.map((element) => {
    if (element.type === "item") {
      return {
        id: element.id,
        originalList: element.originalList,
        items: [createSimpleItem(element.id, element.content)],
        isImported: element.originalList.id !== listId,
        exportedTo: element.exportedTo,
        dragId: element.id || createDragId(),
        auto: false,
      };
    }

    const listElements = convertToEditListSimpleItems(element.items);

    return {
      id: element.id,
      originalList: {
        id: element.id,
        name: element.name,
      },
      items: listElements,
      isImported: true,
      exportedTo: element.exportedTo,
      dragId: element.id || createDragId(),
      auto: false,
    };
  });
}

function createSimpleItem(id: ItemId, content: ItemContent): EditListSimpleItem {
  return {
    id,
    content,
  };
}

export function convertEditListToImportedListElement(list: EditListType): EditListElement {
  return {
    id: list.id,
    originalList: {
      id: list.id,
      name: list.name,
    },
    items: convertToEditListSimpleItems(list.elements.map((element) => element.items).flat()),
    isImported: true,
    exportedTo: list.exportedTo,
    dragId: list.id,
    auto: false,
  };
}

function convertToEditListSimpleItems(
  items: { id: ItemId; content: ItemContent }[],
): [EditListSimpleItem, ...EditListSimpleItem[]] {
  if (items.length) {
    return items.map(({ id, content }) => createSimpleItem(id, content)) as [
      EditListSimpleItem,
      ...EditListSimpleItem[],
    ];
  }

  return [createSimpleItem("", "")];
}
