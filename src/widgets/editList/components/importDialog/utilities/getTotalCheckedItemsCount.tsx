import { getEditListElementsWithoutAutoItem } from "../../../utilities/getEditListElementsWithoutAutoItem.tsx";

import { getCheckedImportItemsCount } from "./getCheckedImportItemsCount.tsx";

export function getTotalCheckedItemsCount() {
  return getCheckedImportItemsCount() + getEditListElementsWithoutAutoItem().length;
}
