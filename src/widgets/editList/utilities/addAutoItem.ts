import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultItem } from "./createDefaultItem.ts";

export function addAutoItem() {
  const items = storeEditList.items;
  const lastIndex = items.length - 1;
  const lastItem = items[lastIndex];
  const lastItemContent = lastItem?.content.trim();

  if (lastItemContent === "" && lastItem?.auto) {
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

  const autoItem = createDefaultItem(storeEditList.id, true);
  setStoreEditList("items", items.length, autoItem);
}
