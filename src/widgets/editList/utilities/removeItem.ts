import { setStoreEditList } from "../editList.store.tsx";

export function removeItem(
  indexToRemove: number,
  removedExportedItem?: { id: string; deletionMethod: "deletion" | "insertion" },
) {
  if (removedExportedItem?.id) {
    setStoreEditList("removedExportedItems", (items) => [...items, removedExportedItem]);
  }

  setStoreEditList("elements", (element) => {
    return element.filter((_element, index) => index !== indexToRemove);
  });
}
