import type { ImportDialogItem } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { convertItemsFromBackendToEditListItems } from "./convertItemsFromBackendToEditListItems.ts";
import { scroller } from "./scrollToBottom.ts";

export function addImportItems(importItems: ImportDialogItem[]) {
  const currentItems = storeEditList.items;
  const autoItemIndex = currentItems.findIndex((item) => item.auto);

  setStoreEditList("items", [
    ...currentItems.slice(0, autoItemIndex),
    ...convertItemsFromBackendToEditListItems(importItems),
    ...currentItems.slice(autoItemIndex),
  ]);

  scroller.scrollToBottom();
}
