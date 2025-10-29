import type { DragItem } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultItem } from "./createDefaultItem.ts";
import { pasteItemsBeforeAutoListItem } from "./pasteItemsBeforeAutoListItem.ts";
import { reachedItemsLimit } from "./reachedItemsLimit.ts";
import { scroller } from "./scrollToBottom.ts";

export function addNewItem() {
  if (reachedItemsLimit()) return;

  const resultingItems: DragItem[] = pasteItemsBeforeAutoListItem([createDefaultItem(storeEditList.id)]);

  setStoreEditList("items", resultingItems);

  scroller.scrollToBottom();
}
