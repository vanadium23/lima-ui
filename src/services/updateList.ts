import type { BackendList, UpdatedList } from "../types.ts";

export async function updateList(
  data: UpdatedList,
  backendURL?: string,
): Promise<BackendList> {
  let backend = "";

  if (backendURL) {
    backend = backendURL;
  } else {
    backend = import.meta.env.PUBLIC_API_URL;
  }

  const response = await fetch(`${backend}/lists/${data.id}`, {
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
