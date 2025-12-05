import { storeImportDialog } from "../importDialog.tsx";

export function getCheckedImportItemsCount() {
  return Object.values(storeImportDialog.checkedItemsCount).reduce((sum, count) => sum + count, 0);
}
