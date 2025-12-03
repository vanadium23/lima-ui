import type { EditListType } from "../../../types/types.ts";
import { getLists } from "../../services/getLists.ts";
import { convertListFromBackendToEditList } from "../editList.store.tsx";

export async function getListsForImporting(): Promise<EditListType[]> {
  return (await getLists()).map(convertListFromBackendToEditList);
}
