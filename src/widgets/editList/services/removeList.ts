import { BACKEND_LISTS } from "../../../../utilities/addresses.ts";

export async function removeList(
  id: string,
  backendURL?: string,
): Promise<void> {
  if (!id) {
    throw new Error("Потерялся ID списка");
  }

  const backend = backendURL || import.meta.env.PUBLIC_API_URL;

  const response = await fetch(`${backend}${BACKEND_LISTS}${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}
