import { BACKEND_URL_LISTS } from "../../../../utilities/addresses.ts";
import type { List } from "../../../types/types.ts";

export async function getLists(
  backendURL = import.meta.env.PUBLIC_API_URL,
  backendListsAddress = BACKEND_URL_LISTS,
): Promise<List[]> {
  const response = await fetch(`${backendURL}${backendListsAddress}`);

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}
