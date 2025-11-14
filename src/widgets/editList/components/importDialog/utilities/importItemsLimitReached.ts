import { ITEMS_LIMIT } from "../../../../../../configuration.ts";
import { storeEditList } from "../../../editList.store.tsx";
import { storeImportDialog } from "../importDialog.tsx";

export function importItemsLimitReached() {
  const currentListItemsCount = storeEditList.items.filter((item) => !item.auto).length;

  return currentListItemsCount + storeImportDialog.checkedItemsCount >= ITEMS_LIMIT;
}
