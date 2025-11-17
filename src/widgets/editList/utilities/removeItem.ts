import { setStoreEditList, storeEditList } from "../editList.store.tsx";

export function removeItem(indexToRemove: number) {
  setStoreEditList("items", (items) => {
    return items.filter((_item, index) => index !== indexToRemove);
  });

  if (storeEditList.items.length === 1) {
    setStoreEditList("items", 0, "auto", false);
  }
}
