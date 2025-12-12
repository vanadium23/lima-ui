import { ITEMS_LIMIT } from "../../../../../../configuration.ts";

import { getTotalCheckedItemsCount } from "./getTotalCheckedItemsCount.tsx";

export function isImportDialogLimitReached() {
  return getTotalCheckedItemsCount() > ITEMS_LIMIT;
}
