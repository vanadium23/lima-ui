import { createStore } from "solid-js/store";

import { ITEMS_LIMIT } from "../../../configuration.ts";
import type { DragItem, DragList, List } from "../../types/types.ts";

import { createDefaultItem } from "./utilities/createDefaultItem.ts";
import { convertItemsToDragItems } from "./utilities/dragAndDrop.ts";

export type EditListStore = DragList & {
  initialList: List;
  sendingNow: false | "saving" | "deleting";
  error: boolean;
  removeError: boolean;
  isCheckable: boolean;
  isChanged: boolean;
  isNewList: boolean;
  draggedItem: string;
  itemsScrollStartPosition: number;
};

export const emptyList: List = {
  id: "",
  name: "",
  purpose: "",
  note: "",
  items: [{ content: "", id: "", originalListId: "" }],
};

export const [storeEditList, setStoreEditList] = createStore<EditListStore>({
  id: "",
  items: [],
  name: "",
  purpose: "",
  note: "",
  initialList: emptyList,
  sendingNow: false,
  error: false,
  removeError: false,
  isCheckable: false,
  isChanged: false,
  isNewList: "" === "",
  draggedItem: "",
  itemsScrollStartPosition: 0,
});

function addAutoItemIfNeeded(listId: List["id"], items: DragItem[]): DragItem[] {
  if (items.length >= ITEMS_LIMIT) {
    return items;
  }

  if (items.length === 0 || lastItemIsNotEmpty(items)) {
    return [...items, createDefaultItem(listId, true)];
    // че-то поломано, добавляется пункт в новый список но он не является автопунктом
  }

  function lastItemIsNotEmpty(items: DragItem[]) {
    return items.at(-1)?.content.trim() !== "";
  }

  return items;
}

export function initStoreEditList(defaultList: List) {
  updateStoreEditList(defaultList);
}

export function updateStoreEditList(updatedList: List) {
  setStoreEditList({
    id: updatedList.id,
    items: addAutoItemIfNeeded(updatedList.id, convertItemsToDragItems(updatedList.items)),
    name: updatedList.name,
    purpose: updatedList.purpose,
    note: updatedList.note,
    initialList: updatedList,
    isNewList: updatedList.id === "",
    sendingNow: false,
  });
}
