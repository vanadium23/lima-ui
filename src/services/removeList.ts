export async function removeList(
  id: string,
  backendURL?: string,
): Promise<void> {
  const backend = backendURL || import.meta.env.PUBLIC_API_URL;

  const response = await fetch(`${backend}/lists/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return await response.json();
}
