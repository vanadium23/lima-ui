import { setStoreEditList } from "../editList.store.tsx";

export function removeItem(
  indexToRemove: number,
  deletedExportedItem?: { id: string; deletionMethod: "deletion" | "insertion" },
) {
  if (deletedExportedItem?.id) {
    setStoreEditList("deletedExportedItems", (items) => [...items, deletedExportedItem]);
  }

  setStoreEditList("elements", (element) => {
    return element.filter((_element, index) => index !== indexToRemove);
  });
}
