import { BACKEND_LISTS } from "../../../../utilities/addresses.ts";
import type { List } from "../types.ts";

export async function updateList(
  data: List,
  backendURL?: string,
): Promise<List> {
  let backend: string;

  if (backendURL) {
    backend = backendURL;
  } else {
    backend = import.meta.env.PUBLIC_API_URL;
  }

  const listData = {
    ...data,
    items: data.items.map((item) => {
      if (item.id) {
        return item;
      } else {
        return { content: item.content };
      }
    }),
  };

  const response = await fetch(`${backend}${BACKEND_LISTS}${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listData),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}
