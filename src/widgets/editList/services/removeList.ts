import { BACKEND_URL_LISTS } from "../../../../utilities/addresses.ts";
import type { ListId } from "../../../types/types.ts";

export type DeletionMethod = "deletion" | "insertion" | "";

export async function removeList(id: ListId, deletionMethod: DeletionMethod = "", backendURL = "/api"): Promise<void> {
  if (!id) {
    throw new Error("Потерялся ID списка");
  }
  const response = await fetch(`${backendURL}${BACKEND_URL_LISTS}/${id}`, {
    method: "DELETE",
    ...(deletionMethod
      ? {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deletionMethod }),
        }
      : {}),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}
