import type { Account } from "./types.ts";

export const LOGIN_ERROR_WRONG_CREDENTIALS = "password-wrong";

export class LoginError extends Error {
  constructor(public readonly code: string) {
    super(`Login failed: ${code}`);
  }
}

export async function loginToAccount(data: Account): Promise<void> {
  const response = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { errors } = await response.json().catch(() => ({ errors: [] }));
    throw new LoginError(errors?.[0]?.id ?? response.statusText);
  }
}
