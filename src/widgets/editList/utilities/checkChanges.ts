import type { EditListElement, EditListType, ListName } from "../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";

import { createDefaultElement } from "./createDefaultItem.ts";

// Идет проверка списка на изменения относительно содержания
// ИЗНАЧАЛЬНО инициализированного списка при загрузке страницы

export function checkChanges(
  currentListName: ListName,
  currentListPurpose: EditListType["purpose"],
  currentListNote: EditListType["note"],
  currentListElements: EditListElement[],
) {
  const initialData = storeEditList.initialList;

  const hasChanges =
    initialData.name.trimEnd() !== currentListName.trimEnd() ||
    initialData.purpose.trimEnd() !== currentListPurpose.trimEnd() ||
    initialData.note.trimEnd() !== currentListNote.trimEnd() ||
    itemsChanged(initialData.elements, currentListElements);

  setStoreEditList("isChanged", hasChanges);
}

function itemsChanged(initialElements: EditListElement[], currentElements: EditListElement[]) {
  const currentElementsWithoutAutoItem = currentElements.filter((element) => !element.auto);

  if (initialElements.length !== currentElementsWithoutAutoItem.length) {
    return true;
  }

  return initialElements.some((initialElement, index) => {
    const currentElement = currentElements[index] || createDefaultElement();

    return initialElement.items.some((initialItem, itemIndex) => {
      const currentItem = currentElement.items[itemIndex] || createDefaultElement().items[0];

      return initialItem.id !== currentItem.id || initialItem.content.trimEnd() !== currentItem.content.trimEnd();
    });
  });
}
