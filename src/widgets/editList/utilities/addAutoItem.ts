import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultItem } from "./createDefaultItem.ts";
import { reachedItemsLimit } from "./reachedItemsLimit.ts";

export function addAutoItem() {
  const items = storeEditList.items;
  const lastIndex = items.length - 1;
  const lastItem = items[lastIndex];
  const lastItemContent = lastItem?.content.trim();
  const autoItemIndex = items.findIndex((item) => item.auto);

  if (reachedItemsLimit() && lastItem?.auto) {
    setStoreEditList("items", [...items.slice(0, autoItemIndex)]);
  }

  if (lastItemContent === "" && lastItem?.auto) {
    return;
  }

  if (reachedItemsLimit() && lastItemContent !== "") {
    setStoreEditList("items", lastIndex, "auto", false);

    return;
  }

  if (lastItemContent === "") {
    setStoreEditList("items", lastIndex, "auto", true);

    return;
  }

  items.forEach((item, index) => {
    if (item.auto) {
      setStoreEditList("items", index, "auto", false);
    }
  });

  if (!reachedItemsLimit()) {
    const autoItem = createDefaultItem(storeEditList.id, true);
    setStoreEditList("items", items.length, autoItem);
  }
}
