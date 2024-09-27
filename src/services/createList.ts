import { logReturn } from "../../features/utilities/logReturn.ts";

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

  console.log(Date.now());

  const response = await fetch(logReturn(`${backend}lists`), {
    method: "POST", // или 'PUT', 'DELETE', и т.д.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // преобразование объекта данных в JSON строку
  });

  const time = new Date().getTime();
  let i = 0;
  while (Date.now() - time < 500) {
    i++;
  }
  console.log(i);

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  return await response.json();
}
