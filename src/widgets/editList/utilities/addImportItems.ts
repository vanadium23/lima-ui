import type { EditListElement } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { scroller } from "./scrollToBottom.ts";

export function addImportItems(importedItems: EditListElement[]) {
  const currentItems = storeEditList.elements;
  const autoItemIndex = currentItems.findIndex((item) => item.auto);

  setStoreEditList("elements", [
    ...currentItems.slice(0, autoItemIndex),
    ...importedItems,
    ...currentItems.slice(autoItemIndex),
  ]);

  scroller.scrollToBottom();
}
