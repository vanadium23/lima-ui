import { BACKEND_URL_USERS } from "../../../../utilities/addresses.ts";

import type { Account } from "./types.ts";

export async function registerNewAccount(data: Account, backendURL = "/api"): Promise<undefined> {
  const response = await fetch(backendURL + BACKEND_URL_USERS, {
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
