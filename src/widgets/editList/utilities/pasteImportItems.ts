import type { EditListElement } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

export function pasteImportedItemsBefore(index: number, importedItems: EditListElement[]) {
  pasteImportedItems(index, importedItems);
}

export function pasteImportedItemsAfter(index: number, importedItems: EditListElement[]) {
  pasteImportedItems(index + 1, importedItems);
}

function pasteImportedItems(insertIndex: number, importedElements: EditListElement[]) {
  const separatedItemsBeforeNewItem = storeEditList.elements.slice(0, insertIndex).map((item) => ({
    ...item,
    auto: false,
  }));

  const separatedItemsAfterNewItem = storeEditList.elements.slice(insertIndex);

  const resultingItems = [...separatedItemsBeforeNewItem, ...importedElements, ...separatedItemsAfterNewItem];

  setStoreEditList("elements", resultingItems);
}
