import type { AstroCookies } from "astro";

const JSON_HEADERS = { "Content-Type": "application/json" };

export async function proxyBackendResponse(backendResponse: Response): Promise<Response> {
  const responseData = await backendResponse.json().catch(() => ({}));

  return new Response(JSON.stringify(responseData), {
    status: backendResponse.status,
    headers: JSON_HEADERS,
  });
}

export function getAuthorizationHeaders(cookies: AstroCookies): HeadersInit | null {
  const token = cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  return {
    ...JSON_HEADERS,
    Authorization: `Bearer ${token}`,
  };
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: JSON_HEADERS,
  });
}
