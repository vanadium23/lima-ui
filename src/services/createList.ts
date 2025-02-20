import type { BackendList, NewList } from "../types.ts";

export async function createList(
  data: NewList,
  backendURL?: string,
): Promise<BackendList> {
  let backend = "";

  if (backendURL) {
    backend = backendURL;
  } else {
    backend = import.meta.env.PUBLIC_API_URL;
  }

  const response = await fetch(`${backend}/lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // преобразование объекта данных в JSON строку
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}
