import { setStoreEditList } from "../editList.store.tsx";

export function removeItem(
  indexToRemove: number,
  exportedItemDeletionMethod?: { id: string; deletionMethod: "deletion" | "insertion" },
) {
  if (exportedItemDeletionMethod?.id) {
    setStoreEditList("exportedItemsDeletionMethods", (items) => [...items, exportedItemDeletionMethod]);
  }

  setStoreEditList("elements", (element) => {
    return element.filter((_element, index) => index !== indexToRemove);
  });
}
