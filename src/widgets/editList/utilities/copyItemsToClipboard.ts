import type { Item } from "../../../types/types.ts";

export function copyItemsToClipboard(items: Item[]) {
  const textToCopy = items.map((item) => item.content.trim()).join("\n");
  navigator.clipboard.writeText(textToCopy).catch(() => {});
}
