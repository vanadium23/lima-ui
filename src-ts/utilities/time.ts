// Small shared helpers around JSON responses and time formatting.

// Instant.toString-style UTC ISO string, e.g. 2026-10-04T12:34:56.789Z.
export const nowISOString = (): string => new Date().toISOString();

export const nowMinusSecondsISOString = (seconds: number): string =>
  new Date(Date.now() - seconds * 1000).toISOString();
