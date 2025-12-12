import { getLists } from "../../../services/getLists.ts";
import { type EditListType, isItemFromBackend, type ListFromBackend, type ListId } from "../../../types/types.ts";
import { convertListFromBackendToEditList } from "../editList.store.tsx";

export async function getListsForImporting(importingListId: ListId): Promise<EditListType[]> {
  return (await getLists()).filter(isListWithoutCircularReference).map(convertListFromBackendToEditList);

  function isListWithoutCircularReference(list: ListFromBackend): boolean {
    return (
      list.id !== importingListId &&
      list.items.every((element) => {
        if (isItemFromBackend(element)) {
          return true;
        }

        return isListWithoutCircularReference(element);
      })
    );
  }
}
