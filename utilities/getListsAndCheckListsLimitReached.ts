import { LISTS_LIMIT } from "../configuration.ts";
import { getLists } from "../src/services/getLists.ts";
import type { ListFromBackend } from "../src/types/types.ts";

import { BACKEND_URL_LISTS, BACKEND_URL_NON_EXISTING } from "./addresses.ts";

export async function getListsAndCheckListsLimitReached(currentUrl?: URL) {
  let lists: ListFromBackend[] = [];

  let isListsLimitReached = false;

  let listsRequestError = false;

  try {
    const backendURL = import.meta.env.SERVER_API_URL;
    let backendListsAddress = BACKEND_URL_LISTS;

    if (currentUrl?.searchParams.get("error") === "true") {
      backendListsAddress = BACKEND_URL_NON_EXISTING;
    }

    lists = await getLists(backendURL, backendListsAddress);

    isListsLimitReached = lists.length >= LISTS_LIMIT;
  } catch {
    listsRequestError = true;
    console.error("Error fetching lists from backend");
  }

  return { lists, isListsLimitReached, listsRequestError };
}
