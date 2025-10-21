import type { DragItem, Items, List } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultItem } from "./createDefaultItem.ts";

// Идет проверка списка на изменения относительно содержания
// ИЗНАЧАЛЬНО инициализированного списка при загрузке страницы

export function checkChanges(
  currentListName: List["name"],
  currentListPurpose: List["purpose"],
  currentListNote: List["note"],
  currentListItems: DragItem[],
) {
  const initialData = storeEditList.initialList;

  const hasChanges =
    initialData.name !== currentListName ||
    initialData.purpose !== currentListPurpose ||
    initialData.note !== currentListNote ||
    itemsChanged(initialData.items, currentListItems);

  setStoreEditList("isChanged", hasChanges);
}

function itemsChanged(initialItems: Items, currentItemsWithAutoItem: DragItem[]) {
  const currentItems = currentItemsWithAutoItem.filter((item) => !item.auto);

  if (initialItems.length !== currentItems.length) {
    return true;
  }

  return initialItems.some((initialItem, index) => {
    const currentItem = currentItems[index] || createDefaultItem();

    return initialItem.id !== currentItem.id || initialItem.content !== currentItem.content;
  });
}
