import { EditListFormNames, type EditListStore, type Item, type SimpleItem } from "../../../types/types.ts";

export function prepareListItemsDataForSending(elements: HTMLInputElement[], store: EditListStore) {
  const itemsInputs = elements.filter((element) => {
    return element.name.startsWith(EditListFormNames.ListItem);
  });

  return itemsInputs
    .map((itemInput) => {
      const content = itemInput.value.trim();
      const id = String(itemInput.dataset.id?.trim());

      if (id) {
        return { id, content };
      } else {
        return { content };
      }
    })
    .filter((item, index) => item.content !== "" || index < store.items.length - 1)
    .map((item) => {
      if (!item.id) {
        return item;
      }

      const initialItem = store.initialList.items.find((initialItemCandidate) => {
        return initialItemCandidate.id === item.id;
      });

      if (!initialItem) {
        return item;
      }

      if (isItemUnchanged(item, initialItem)) {
        return { id: item.id };
      }

      return item;
    });
}

function isItemUnchanged(item: SimpleItem, initialItem: Item) {
  return item.id === initialItem.id && item.content === initialItem.content;
}
