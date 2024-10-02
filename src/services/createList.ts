export type ListData = {
  name: string;
  purpose?: string;
  items: { content: string }[];
  note?: string;
};

export async function createList(data: ListData, backendURL?: string) {
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
