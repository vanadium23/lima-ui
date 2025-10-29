import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultItem } from "./createDefaultItem.ts";
import { reachedItemsLimit } from "./reachedItemsLimit.ts";

export function addAutoItem() {
  const lastIndex = storeEditList.items.length - 1;
  const lastItem = storeEditList.items[lastIndex];
  const lastItemContent = lastItem?.content.trim();

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

  storeEditList.items.forEach((item, index) => {
    if (item.auto) {
      setStoreEditList("items", index, "auto", false);
      console.log(`Сработало третье условие ${index}`);
    }
  });

  const autoItem = createDefaultItem(storeEditList.id, true);
  setStoreEditList("items", storeEditList.items.length, autoItem);
}
