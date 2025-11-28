import type { EditListItem, ItemFromBackend } from "../../../types/types.ts";

import { createDragId } from "./createDefaultItem.ts";

export function convertItemsFromBackendToEditListItems(items: ItemFromBackend[]): EditListItem[] {
  return items.map((item) => ({
    ...item,
    dragId: item.id || createDragId(),
    auto: false,
  }));
}
