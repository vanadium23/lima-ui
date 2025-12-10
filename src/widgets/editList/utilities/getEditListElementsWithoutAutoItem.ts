import { storeEditList } from "../editList.store.tsx";

export function getEditListElementsWithoutAutoItem() {
  return storeEditList.elements.filter((item) => !item.auto);
}
