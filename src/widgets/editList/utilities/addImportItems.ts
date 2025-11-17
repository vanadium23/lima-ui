import type { Items } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { convertItemsToDragItems } from "./dragAndDrop.ts";
import { scroller } from "./scrollToBottom.ts";

export function addImportItems(importItems: Items) {
  const currentItems = storeEditList.items;
  const autoItemIndex = currentItems.findIndex((item) => item.auto);

  setStoreEditList("items", [
    ...currentItems.slice(0, autoItemIndex),
    ...convertItemsToDragItems(importItems),
    ...currentItems.slice(autoItemIndex),
  ]);

  scroller.scrollToBottom();
}
