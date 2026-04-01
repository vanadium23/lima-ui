import type { APIRoute } from "astro";

import { BACKEND_URL_AUTH_LOGIN } from "../../../utilities/addresses.ts";
import { setSessionCookie } from "../../../utilities/setSessionCookie.ts";

const createSession: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();

  const backendResponse = await fetch(`${import.meta.env.SERVER_API_URL}${BACKEND_URL_AUTH_LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!backendResponse.ok) {
    const errorData = await backendResponse.json().catch(() => ({}));

    return new Response(JSON.stringify(errorData), {
      status: backendResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { token: authToken } = await backendResponse.json();

  setSessionCookie(cookies, authToken);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export { createSession as POST };
