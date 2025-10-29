import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { removeItem } from "./removeItem.ts";

export function handleItemChange(index: number, value: string) {
  setStoreEditList("items", index, "content", value);

  const lastIndex = storeEditList.items.length - 1;
  const beforeLastIndex = lastIndex - 1;

  if (
    storeEditList.items.length !== 1 &&
    index === beforeLastIndex &&
    storeEditList.items[lastIndex]?.content.trim() === "" &&
    storeEditList.items[beforeLastIndex]?.content.trim() === ""
  ) {
    removeItem(lastIndex);
  }
}
