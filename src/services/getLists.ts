import { BACKEND_URL_LISTS } from "../../utilities/addresses.ts";
import type { ListFromBackend } from "../types/types.ts";

export async function getLists(
  backendURL = "/api",
  backendListsAddress = BACKEND_URL_LISTS,
  token?: string,
): Promise<ListFromBackend[]> {
  const response = await fetch(`${backendURL}${backendListsAddress}`, {
    ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}
