import { URL_AUTH } from "../../../../utilities/addresses.ts";

export async function logout(): Promise<void> {
  await fetch("/api/session", { method: "DELETE" });

  window.location.replace(URL_AUTH);
}
