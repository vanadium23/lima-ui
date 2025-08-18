import type { SetStoreFunction } from "solid-js/store";

import type { DragItems, EditListStore, Items } from "../types.ts";

import { createDefaultItem } from "./createDefaultItem.ts";

export function checkChanges(
  store: EditListStore,
  setStore: SetStoreFunction<EditListStore>,
) {
  const initialData = store.initialList;
  const currentData = store;

  const hasChanges =
    initialData.name !== currentData.name ||
    initialData.purpose !== currentData.purpose ||
    initialData.note !== currentData.note ||
    itemsChanged(initialData.items, currentData.items);

  setStore("isChanged", hasChanges);
}

function itemsChanged(
  initialItems: Items,
  currentItemsWithAutoItem: DragItems,
) {
  const currentItems = currentItemsWithAutoItem.filter((item) => !item.auto);

  if (initialItems.length !== currentItems.length) {
    return true;
  }

  return initialItems.some((initialItem, index) => {
    const currentItem = currentItems[index] || createDefaultItem();

    return (
      initialItem.id !== currentItem.id ||
      initialItem.content !== currentItem.content
    );
  });
}
