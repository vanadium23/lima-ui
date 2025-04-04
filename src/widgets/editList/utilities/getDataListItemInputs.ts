import { EditListFormNames, type EditListStore } from "../types.ts";

export function getDataListItemInputs(
  elements: HTMLInputElement[],
  store: EditListStore,
) {
  const itemsInputs = elements.filter((element) => {
    return element.name.startsWith(EditListFormNames.ListItem);
  });

  return itemsInputs
    .map((itemInput) => {
      const content = itemInput.value.trim();
      const id = String(itemInput.dataset.id?.trim());

      return { id, content };
    })
    .filter(
      (item, index) => item.content !== "" || index < store.items.length - 1,
    );
}
