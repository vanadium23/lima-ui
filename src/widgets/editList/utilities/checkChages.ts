import type { SetStoreFunction } from "solid-js/store";

import type { ComparableList, EditListStore } from "../types.ts";

import { getComparableList } from "./getComparableList.ts";

export function checkChanges(
  initialData: ComparableList,
  store: EditListStore,
  setStore: SetStoreFunction<EditListStore>,
) {
  const currentData = getComparableList(store);

  const hasChanges =
    currentData.items !== initialData.items ||
    currentData.name !== initialData.name ||
    currentData.purpose !== initialData.purpose ||
    currentData.note !== initialData.note;

  setStore("isChanged", hasChanges);
}
