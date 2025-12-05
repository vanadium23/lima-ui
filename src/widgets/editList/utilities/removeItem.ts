import { setStoreEditList } from "../editList.store.tsx";

export function removeItem(indexToRemove: number) {
  setStoreEditList("elements", (element) => {
    return element.filter((_element, index) => index !== indexToRemove);
  });
}
