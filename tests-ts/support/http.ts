// Thin HTTP client mirroring the clj-http subset the Clojure steps rely
// on: never throws on HTTP statuses (:throw-exceptions false), JSON
// bodies in/out, optional bearer token, and manual redirects by default
// (clj-http does not follow redirects unless :redirect-strategy :lax —
// deletion requests opt into following via `followRedirects: true`).
export interface ApiResponse {
  status: number;
  body: unknown;
  text: string;
  headers: Headers;
}

export interface RequestOptions {
  body?: unknown;
  rawBody?: string;
  token?: string;
  headers?: Record<string, string>;
  // Explicit body without a Content-Type header (no-content-type scenarios).
  noContentType?: boolean;
  followRedirects?: boolean;
}

const parseJson = (text: string): unknown => {
  if (text === "") {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const request = async (
  method: string,
  url: string,
  options: RequestOptions = {},
): Promise<ApiResponse> => {
  const headers: Record<string, string> = { ...options.headers };
  const hasBody = options.body !== undefined || options.rawBody !== undefined;
  if (hasBody && options.noContentType !== true) {
    headers["Content-Type"] ??= "application/json";
  }
  if (options.token !== undefined) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  const response = await fetch(url, {
    method,
    headers,
    body:
      options.rawBody !== undefined
        ? options.rawBody
        : options.body === undefined
          ? undefined
          : JSON.stringify(options.body),
    redirect: options.followRedirects === true ? "follow" : "manual",
  });
  const text = await response.text();
  return {
    status: response.status,
    body: parseJson(text),
    text,
    headers: response.headers,
  };
};

// utilities.handle-raw-data parse-body-from-JSON: response body → parsed
// value (Clojure keywordizes keys; here JSON keys stay as-is).
export const parseBodyFromJson = (response: ApiResponse): unknown =>
  response.body;
