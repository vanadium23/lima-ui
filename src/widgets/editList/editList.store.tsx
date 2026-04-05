import { createStore } from "solid-js/store";

import type { EditListType, ListFromBackend } from "../../types/types.ts";

import { addAutoItem } from "./utilities/addAutoItem.ts";
import { convertElementsFromBackendToEditListElements as convertListElementsFromBackendToEditListElements } from "./utilities/convertItemsFromBackendToEditListItems.ts";

export type EditListStore = EditListType & {
  initialList: EditListType;
  sendingNow: false | "saving" | "deleting";
  error: boolean;
  removeError: boolean;
  isChanged: boolean;
  isNewList: boolean;
  draggedItem: string;
  itemsScrollStartPosition: number;
  hasExportedItems: boolean;
  exportedItemsDeletionMethods: { id: string; deletionMethod: "deletion" | "insertion" }[];
};

export const emptyList: EditListType = {
  type: "list",
  id: "",
  name: "",
  purpose: "",
  note: "",
  elements: [],
  exportedTo: [],
  hasExportedItems: false,
};

export const emptyListFromBackend: ListFromBackend = {
  type: "list",
  id: "",
  name: "",
  purpose: "",
  note: "",
  items: [],
  exportedTo: [],
  hasExportedItems: false,
};

export const [storeEditList, setStoreEditList] = createStore<EditListStore>({
  type: "list",
  id: "",
  name: "",
  purpose: "",
  note: "",
  elements: [],
  exportedTo: [],
  hasExportedItems: false,
  initialList: emptyList,
  sendingNow: false,
  error: false,
  removeError: false,
  isChanged: false,
  isNewList: "" === "",
  draggedItem: "",
  itemsScrollStartPosition: 0,
  exportedItemsDeletionMethods: [],
});

export function initStoreEditList(defaultList: ListFromBackend) {
  updateStoreEditList(defaultList);
  addAutoItem();
}

export function updateStoreEditList(updatedList: ListFromBackend) {
  setStoreEditList({
    ...convertListFromBackendToEditList(updatedList),
    initialList: convertListFromBackendToEditList(updatedList),
    isNewList: updatedList.id === "",
    sendingNow: false,
  });
}

export function convertListFromBackendToEditList(updatedList: ListFromBackend): EditListType {
  return {
    type: "list",
    id: updatedList.id,
    elements: convertListElementsFromBackendToEditListElements(updatedList.items, updatedList.id),
    name: updatedList.name,
    purpose: updatedList.purpose,
    note: updatedList.note,
    exportedTo: updatedList.exportedTo || [],
    hasExportedItems: updatedList.hasExportedItems,
  };
}
