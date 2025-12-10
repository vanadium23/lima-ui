import { getEditListElementsWithoutAutoItem } from "../../../utilities/getEditListElementsWithoutAutoItem.ts";

import { getCheckedImportItemsCount } from "./getCheckedImportItemsCount.tsx";

export function getTotalCheckedItemsCount() {
  return getCheckedImportItemsCount() + getEditListElementsWithoutAutoItem().length;
}
