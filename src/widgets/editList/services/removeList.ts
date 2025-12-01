import { BACKEND_URL_LISTS } from "../../../../utilities/addresses.ts";
import type { ListId } from "../../../types/types.ts";

export async function removeList(id: ListId, backendURL = import.meta.env.PUBLIC_API_URL): Promise<void> {
  if (!id) {
    throw new Error("Потерялся ID списка");
  }
  const response = await fetch(`${backendURL}${BACKEND_URL_LISTS}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}
