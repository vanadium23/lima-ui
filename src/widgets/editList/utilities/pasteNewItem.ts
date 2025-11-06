import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultItem } from "./createDefaultItem.ts";
import { reachedItemsLimit } from "./reachedItemsLimit.ts";

export function pasteItemBefore(index: number) {
  pasteNewItem(index);
}

export function pasteItemAfter(index: number) {
  pasteNewItem(index + 1);
}

function pasteNewItem(insertIndex: number) {
  if (reachedItemsLimit()) return;

  const separatedItemsBeforeNewItem = storeEditList.items.slice(0, insertIndex).map((item) => ({
    ...item,
    auto: false,
  }));

  const separatedItemsAfterNewItem = storeEditList.items.slice(insertIndex);

  const resultingItems = [
    ...separatedItemsBeforeNewItem,
    createDefaultItem(storeEditList.id),
    ...separatedItemsAfterNewItem,
  ];

  setStoreEditList("items", resultingItems);
}
