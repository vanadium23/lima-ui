import type { APIRoute } from "astro";

import { BACKEND_URL_LISTS } from "../../../../utilities/addresses.ts";
import {
  getAuthorizationHeaders,
  proxyBackendResponse,
  unauthorizedResponse,
} from "../../../utilities/backendProxy.ts";

export const PATCH: APIRoute = async ({ request, cookies, params }) => {
  const headers = getAuthorizationHeaders(cookies);

  if (!headers) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const backendResponse = await fetch(`${import.meta.env.SERVER_API_URL}${BACKEND_URL_LISTS}/${params.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });

  return proxyBackendResponse(backendResponse);
};

export const DELETE: APIRoute = async ({ request, cookies, params }) => {
  const headers = getAuthorizationHeaders(cookies);

  if (!headers) {
    return unauthorizedResponse();
  }

  const body = request.headers.get("content-type")?.includes("application/json") ? await request.json() : undefined;
  const backendResponse = await fetch(`${import.meta.env.SERVER_API_URL}${BACKEND_URL_LISTS}/${params.id}`, {
    method: "DELETE",
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  return proxyBackendResponse(backendResponse);
};
