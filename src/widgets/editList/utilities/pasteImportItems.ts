import type { Items } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { convertItemsToDragItems } from "./dragAndDrop.ts";

export function pasteImportItemsBefore(index: number, importItems: Items) {
  pasteImportItems(index, importItems);
}

export function pasteImportItemsAfter(index: number, importItems: Items) {
  pasteImportItems(index + 1, importItems);
}

function pasteImportItems(insertIndex: number, importItems: Items) {
  const separatedItemsBeforeNewItem = storeEditList.items.slice(0, insertIndex).map((item) => ({
    ...item,
    auto: false,
  }));

  const separatedItemsAfterNewItem = storeEditList.items.slice(insertIndex);

  const resultingItems = [
    ...separatedItemsBeforeNewItem,
    ...convertItemsToDragItems(importItems),
    ...separatedItemsAfterNewItem,
  ];

  setStoreEditList("items", resultingItems);
}
