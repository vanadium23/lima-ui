// utilities.request-search, ported. The donor's
// prepare-essence-request-data (JSON content type, statuses never
// throw) and prepare-basic-request-settings-with-authorization-header
// (bearer token) are absorbed by support/http.ts. *-JSON fields hold
// the raw response text (clj-http :body string), *-parsed fields the
// parsed body.
import { request, parseBodyFromJson, type ApiResponse } from "../support/http.ts";
import { searchListsRoute } from "./routes.ts";

export const requestSearchLists = (
  token: string | undefined,
  searchData: unknown,
): Promise<ApiResponse> =>
  request("POST", searchListsRoute(), { body: searchData, token });

export interface SearchResult {
  status: number;
  searchResultJson: string;
  searchResultParsed: unknown;
  response: ApiResponse;
}

export const requestSearchListsParsed = async (
  token: string | undefined,
  searchData: unknown,
): Promise<SearchResult> => {
  const searchResult = await requestSearchLists(token, searchData);
  return {
    status: searchResult.status,
    searchResultJson: searchResult.text,
    searchResultParsed: parseBodyFromJson(searchResult),
    response: searchResult,
  };
};
