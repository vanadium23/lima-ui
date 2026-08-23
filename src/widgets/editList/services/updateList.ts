import { BACKEND_URL_LISTS } from "../../../../utilities/addresses.ts";
import type { ListFromBackend, UpdatedListData } from "../../../types/types.ts";

export async function updateList(data: UpdatedListData, backendURL = "/api"): Promise<ListFromBackend> {
  const response = await fetch(`${backendURL}${BACKEND_URL_LISTS}/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}
