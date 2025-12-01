import type { EditList, EditListItem, ItemFromBackend, ListName } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultItem } from "./createDefaultItem.ts";

// Идет проверка списка на изменения относительно содержания
// ИЗНАЧАЛЬНО инициализированного списка при загрузке страницы

export function checkChanges(
  currentListName: ListName,
  currentListPurpose: EditList["purpose"],
  currentListNote: EditList["note"],
  currentListItems: EditListItem[],
) {
  const initialData = storeEditList.initialList;

  const hasChanges =
    initialData.name.trimEnd() !== currentListName.trimEnd() ||
    initialData.purpose.trimEnd() !== currentListPurpose.trimEnd() ||
    initialData.note.trimEnd() !== currentListNote.trimEnd() ||
    itemsChanged(initialData.items, currentListItems);

  setStoreEditList("isChanged", hasChanges);
}

function itemsChanged(initialItems: ItemFromBackend[], currentItems: EditListItem[]) {
  const currentItemsWithoutAutoItem = currentItems.filter((item) => !item.auto);

  if (initialItems.length !== currentItemsWithoutAutoItem.length) {
    return true;
  }

  return initialItems.some((initialItem, index) => {
    const currentItem = currentItems[index] || createDefaultItem();

    return initialItem.id !== currentItem.id || initialItem.content.trimEnd() !== currentItem.content.trimEnd();
  });
}
