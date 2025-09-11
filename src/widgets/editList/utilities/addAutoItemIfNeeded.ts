import { ITEMS_LIMIT } from "../../../../configuration.ts";
import type { DragItems } from "../../../types/types.ts";

import { createDefaultItem } from "./createDefaultItem.ts";

export function addAutoItemIfNeeded(items: DragItems): DragItems {
  if (items.length >= ITEMS_LIMIT) {
    return items;
  }

  if (items.length === 0 || items.at(-1)?.content.trim() !== "") {
    return [...items, createDefaultItem(true)];
  }

  return items;
}
