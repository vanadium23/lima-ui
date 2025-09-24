import { BACKEND_URL_LISTS } from "../../../../utilities/addresses.ts";
import type { List, NewList } from "../../../types/types.ts";

export async function createList(data: NewList, backendURL = import.meta.env.PUBLIC_API_URL): Promise<List> {
  const response = await fetch(backendURL + BACKEND_URL_LISTS, {
    method: "POST",
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
