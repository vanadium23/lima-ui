import type { Item } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { convertItemsFromBackendToEditListItems } from "./convertItemsFromBackendToEditListItems.ts";

export function pasteImportItemsBefore(index: number, importItems: Item[]) {
  pasteImportItems(index, importItems);
}

export function pasteImportItemsAfter(index: number, importItems: Item[]) {
  pasteImportItems(index + 1, importItems);
}

function pasteImportItems(insertIndex: number, importItems: Item[]) {
  const separatedItemsBeforeNewItem = storeEditList.items.slice(0, insertIndex).map((item) => ({
    ...item,
    auto: false,
  }));

  const separatedItemsAfterNewItem = storeEditList.items.slice(insertIndex);

  const resultingItems = [
    ...separatedItemsBeforeNewItem,
    ...convertItemsFromBackendToEditListItems(importItems),
    ...separatedItemsAfterNewItem,
  ];

  setStoreEditList("items", resultingItems);
}
