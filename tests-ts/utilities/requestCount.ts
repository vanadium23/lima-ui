// utilities.request-count, ported.
import { request, parseBodyFromJson, type ApiResponse } from "../support/http.ts";
import { countListsRoute } from "./routes.ts";

export interface CountResult {
  status: number;
  countResult: unknown;
  response: ApiResponse;
}

export const requestListsCount = (token?: string): Promise<ApiResponse> =>
  request("GET", countListsRoute(), { token });

export const requestListsCountParsed = async (token?: string): Promise<CountResult> => {
  const response = await requestListsCount(token);
  return {
    status: response.status,
    countResult: parseBodyFromJson(response),
    response,
  };
};
