import type { AstroCookies } from "astro";

const SESSION_COOKIE_NAME = "token";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // DOC: 90 дней

export function setSessionCookie(cookies: AstroCookies, token: string): void {
  cookies.set(SESSION_COOKIE_NAME, token, {
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}

export function deleteSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
}
