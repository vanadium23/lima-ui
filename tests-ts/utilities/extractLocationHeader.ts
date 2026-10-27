// utilities.extract-Location-header, ported: the Location header of the
// response, null when absent (donor get-in → nil).
import type { ApiResponse } from "../support/http.ts";

export const extractLocationHeader = (response: ApiResponse): string | null =>
  response.headers.get("Location");
