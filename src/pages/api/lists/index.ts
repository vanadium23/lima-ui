import type { APIRoute } from "astro";

import { BACKEND_URL_LISTS } from "../../../../utilities/addresses.ts";
import {
  getAuthorizationHeaders,
  proxyBackendResponse,
  unauthorizedResponse,
} from "../../../utilities/backendProxy.ts";

export const GET: APIRoute = async ({ cookies }) => {
  const headers = getAuthorizationHeaders(cookies);

  if (!headers) {
    return unauthorizedResponse();
  }

  const backendResponse = await fetch(`${import.meta.env.SERVER_API_URL}${BACKEND_URL_LISTS}`, { headers });

  return proxyBackendResponse(backendResponse);
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const headers = getAuthorizationHeaders(cookies);

  if (!headers) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const backendResponse = await fetch(`${import.meta.env.SERVER_API_URL}${BACKEND_URL_LISTS}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return proxyBackendResponse(backendResponse);
};
