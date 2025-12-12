import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultElement } from "./createDefaultItem.ts";

export function addAutoItem() {
  const elements = storeEditList.elements;
  const lastIndex = elements.length - 1;
  const lastItem = elements[lastIndex];
  const lastItemContent = lastItem?.items[0].content.trim();

  if (lastItemContent === "" && lastItem?.auto) {
    return;
  }

  if (lastItemContent === "") {
    setStoreEditList("elements", lastIndex, "auto", true);

    return;
  }

  elements.forEach((item, index) => {
    if (item.auto) {
      setStoreEditList("elements", index, "auto", false);
    }
  });

  const autoItem = createDefaultElement(storeEditList.id, storeEditList.name, "", true);
  setStoreEditList("elements", elements.length, autoItem);
}
