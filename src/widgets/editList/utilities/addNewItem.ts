import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultItem } from "./createDefaultItem.ts";
import { scroller } from "./scrollToBottom.ts";

export function addNewItem() {
  const currentItems = storeEditList.items;
  const autoItemIndex = currentItems.findIndex((item) => item.auto);

  setStoreEditList("items", [
    ...currentItems.slice(0, autoItemIndex),
    createDefaultItem(storeEditList.id),
    ...currentItems.slice(autoItemIndex),
  ]);

  scroller.scrollToBottom();
}
