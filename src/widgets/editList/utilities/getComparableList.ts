import type { ComparableList, Item, List } from "../../../types/types.ts";

export function getComparableList(list: List): ComparableList {
  const notAutoListItem = (item: Item, index: number) => index !== list.items.length - 1 || item.content.trim() !== "";

  return {
    items: JSON.stringify(
      list.items.filter(notAutoListItem).map((item): Item => {
        return { id: item.id, content: item.content };
      }),
    ),
    name: list.name,
    purpose: list.purpose,
    note: list.note,
  };
}
