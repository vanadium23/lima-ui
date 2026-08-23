import { BACKEND_URL_LISTS } from "../../../../utilities/addresses.ts";
import type { ListFromBackend, NewListData } from "../../../types/types.ts";

export async function createList(data: NewListData, backendURL = "/api", token?: string): Promise<ListFromBackend> {
  const response = await fetch(backendURL + BACKEND_URL_LISTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}
