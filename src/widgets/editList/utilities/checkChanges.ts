import type { SetStoreFunction } from "solid-js/store";

import type { EditListStore, Item, Items } from "../types.ts";

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

function itemsChanged(initialItems: Items, currentItemsWithAutoItem: Items) {
  const currentItems = currentItemsWithAutoItem.filter(notAutoListItem);

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

function notAutoListItem(item: Item, index: number, items: Items) {
  return !(index === items.length - 1 && item.content.trim() === "");
}
