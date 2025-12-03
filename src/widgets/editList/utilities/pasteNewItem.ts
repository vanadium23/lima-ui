import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultElement } from "./createDefaultItem.ts";
import { reachedItemsLimit } from "./reachedItemsLimit.ts";

export function pasteItemBefore(index: number) {
  pasteNewItem(index);
}

export function pasteItemAfter(index: number) {
  pasteNewItem(index + 1);
}

function pasteNewItem(insertIndex: number) {
  if (reachedItemsLimit()) return;

  const separatedItemsBeforeNewItem = storeEditList.elements.slice(0, insertIndex).map((item) => ({
    ...item,
    auto: false,
  }));

  const separatedItemsAfterNewItem = storeEditList.elements.slice(insertIndex);

  const resultingItems = [
    ...separatedItemsBeforeNewItem,
    createDefaultElement(storeEditList.id),
    ...separatedItemsAfterNewItem,
  ];

  setStoreEditList("elements", resultingItems);
}
