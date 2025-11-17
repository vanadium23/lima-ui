import { createStore } from "solid-js/store";

import type { DragList, List } from "../../types/types.ts";

import { addAutoItem } from "./utilities/addAutoItem.ts";
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
  items: [],
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

export function initStoreEditList(defaultList: List) {
  updateStoreEditList(defaultList);
  addAutoItem();
}

export function updateStoreEditList(updatedList: List) {
  setStoreEditList({
    id: updatedList.id,
    items: convertItemsToDragItems(updatedList.items),
    name: updatedList.name,
    purpose: updatedList.purpose,
    note: updatedList.note,
    initialList: updatedList,
    isNewList: updatedList.id === "",
    sendingNow: false,
  });
}
