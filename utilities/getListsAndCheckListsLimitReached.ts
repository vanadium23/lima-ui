import { LISTS_LIMIT } from "../configuration.ts";
import { getLists } from "../src/services/getLists.ts";
import type { ListFromBackend } from "../src/types/types.ts";

import { BACKEND_URL_LISTS, BACKEND_URL_NON_EXISTING } from "./addresses.ts";

export async function getListsAndCheckListsLimitReached(currentUrl?: URL, token?: string) {
  let lists: ListFromBackend[] = [];

  let isListsLimitReached = false;

  let listsRequestError = false;

  try {
    // DOC: Contract v2: the API lives under /api; the SSR fetch goes straight
    // DOC: to the internal backend (SERVER_API_URL has no path part).
    const backendURL = `${import.meta.env.SERVER_API_URL}/api`;
    let backendListsAddress = BACKEND_URL_LISTS;

    if (currentUrl?.searchParams.get("error") === "true") {
      backendListsAddress = BACKEND_URL_NON_EXISTING;
    }

    lists = await getLists(backendURL, backendListsAddress, token);

    isListsLimitReached = lists.length >= LISTS_LIMIT;
  } catch {
    listsRequestError = true;
    console.error("Error fetching lists from backend");
  }

  return { lists, isListsLimitReached, listsRequestError };
}
