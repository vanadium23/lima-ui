import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { removeItem } from "./removeItem.ts";

export function handleItemChange(index: number, value: string) {
  setStoreEditList("elements", index, "items", 0, "content", value);

  const lastIndex = storeEditList.elements.length - 1;
  const beforeLastIndex = lastIndex - 1;

  //TODO Разобраться не относиться ли это к удалению автопункта которое уже описано в его функции
  if (
    storeEditList.elements.length !== 1 &&
    index === beforeLastIndex &&
    storeEditList.elements[lastIndex]?.items[0].content.trim() === "" &&
    storeEditList.elements[beforeLastIndex]?.items[0].content.trim() === ""
  ) {
    removeItem(lastIndex);
  }
}
