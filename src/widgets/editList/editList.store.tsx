import { createStore } from "solid-js/store";

import type { EditList, ListFromBackend } from "../../types/types.ts";

import { addAutoItem } from "./utilities/addAutoItem.ts";
import { convertItemsFromBackendToEditListItems } from "./utilities/convertItemsFromBackendToEditListItems.ts";

export type EditListStore = EditList & {
  initialList: ListFromBackend;
  sendingNow: false | "saving" | "deleting";
  error: boolean;
  removeError: boolean;
  isCheckable: boolean;
  isChanged: boolean;
  isNewList: boolean;
  draggedItem: string;
  itemsScrollStartPosition: number;
};

export const emptyList: ListFromBackend = {
  type: "list",
  id: "",
  name: "",
  purpose: "",
  note: "",
  items: [],
  exportedTo: [],
};

export const [storeEditList, setStoreEditList] = createStore<EditListStore>({
  type: "list",
  id: "",
  name: "",
  purpose: "",
  note: "",
  items: [],
  exportedTo: [],
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

export function initStoreEditList(defaultList: ListFromBackend) {
  updateStoreEditList(defaultList);
  addAutoItem();
}

export function updateStoreEditList(updatedList: ListFromBackend) {
  setStoreEditList({
    type: "list",
    id: updatedList.id,
    items: convertItemsFromBackendToEditListItems(updatedList.items),
    name: updatedList.name,
    purpose: updatedList.purpose,
    note: updatedList.note,
    exportedTo: updatedList.exportedTo || [],
    initialList: updatedList,
    isNewList: updatedList.id === "",
    sendingNow: false,
  });
}
