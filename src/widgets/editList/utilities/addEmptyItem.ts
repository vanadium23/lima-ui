import { ITEMS_LIMIT } from "../../../../configuration.ts";
import type { DragItem } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { checkChanges } from "./checkChanges.ts";
import { createDefaultItem } from "./createDefaultItem.ts";
import { reachedItemsLimit } from "./reachedItemsLimit.ts";
import { scroller } from "./scrollToBottom.ts";

type AddItemOptions = { mode: "end"; scroll?: boolean; auto: boolean } | { mode: "before" | "after"; index: number };

export function addEmptyItem(options: AddItemOptions) {
  if (reachedItemsLimit()) return;

  let resultingItems: DragItem[] = [];

  if (options.mode === "end") {
    const items = storeEditList.items.filter((item) => !item.auto);
    const existingAutoItem = storeEditList.items.filter((item) => item.auto);

    resultingItems = [...items, createDefaultItem(storeEditList.id, options.auto), ...existingAutoItem];

    if (options.scroll) {
      scroller.scrollToBottom();
    }
  }

  if (options.mode === "before" || options.mode === "after") {
    const insertIndex = options.mode === "before" ? options.index : options.index + 1;

    resultingItems = [
      ...storeEditList.items.slice(0, insertIndex).map((item) => ({
        ...item,
        auto: false,
      })),
      createDefaultItem(storeEditList.id),
      ...storeEditList.items.slice(insertIndex),
    ];
  }

  setStoreEditList("items", resultingItems.slice(0, ITEMS_LIMIT));
  checkChanges(storeEditList, setStoreEditList);
}
