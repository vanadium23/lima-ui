import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultElement } from "./createDefaultItem.ts";
import { scroller } from "./scrollToBottom.ts";

export function addNewItem() {
  const currentItems = storeEditList.elements;
  const autoItemIndex = currentItems.findIndex((item) => item.auto);

  setStoreEditList("elements", [
    ...currentItems.slice(0, autoItemIndex),
    createDefaultElement(storeEditList.id),
    ...currentItems.slice(autoItemIndex),
  ]);

  scroller.scrollToBottom();
}
