import type { APIRoute } from "astro";

import { BACKEND_URL_USERS } from "../../../utilities/addresses.ts";
import { proxyBackendResponse } from "../../utilities/backendProxy.ts";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const backendResponse = await fetch(`${import.meta.env.SERVER_API_URL}${BACKEND_URL_USERS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return proxyBackendResponse(backendResponse);
};
