import { ITEMS_LIMIT } from "../../../../configuration.ts";
import type { DragItem } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultItem } from "./createDefaultItem.ts";
import { insertItemsBeforeAutoListItem } from "./insertItemsBeforeAutoListItem.ts";
import { reachedItemsLimit } from "./reachedItemsLimit.ts";
import { scroller } from "./scrollToBottom.ts";

function removeAutoItemIfItemsLimitReached(resultingItems: DragItem[]) {
  return resultingItems.slice(0, ITEMS_LIMIT);
}

export function addNewItemEndOrAutoItem(auto: boolean) {
  if (reachedItemsLimit()) return;

  const resultingItems: DragItem[] = insertItemsBeforeAutoListItem([createDefaultItem(storeEditList.id, auto)]);

  setStoreEditList("items", removeAutoItemIfItemsLimitReached(resultingItems));

  if (!auto) {
    scroller.scrollToBottom();
  }
}

export function addNewItemBeforeOrAfter(index: number, place: "after" | "before") {
  if (reachedItemsLimit()) return;

  let insertIndex: number;

  if (place === "after") {
    insertIndex = index + 1;
  } else {
    insertIndex = index;
  }

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

  setStoreEditList("items", removeAutoItemIfItemsLimitReached(resultingItems));
}
