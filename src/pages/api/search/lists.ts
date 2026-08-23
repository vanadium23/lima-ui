import type { APIRoute } from "astro";

import {
  getAuthorizationHeaders,
  proxyBackendResponse,
  unauthorizedResponse,
} from "../../../utilities/backendProxy.ts";

export const POST: APIRoute = async ({ request, cookies }) => {
  const headers = getAuthorizationHeaders(cookies);

  if (!headers) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const backendResponse = await fetch(`${import.meta.env.SERVER_API_URL}/search/lists`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return proxyBackendResponse(backendResponse);
};
