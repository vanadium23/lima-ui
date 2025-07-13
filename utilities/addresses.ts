export const MY_LISTS = "/lists/";
export const LISTS_CREATE = `${MY_LISTS}create`;
export const SOME_LIST = `${MY_LISTS}list-*`;
export const ERROR_SIGN = "?error=true";
export const LISTS_WITH_NETWORK_ERROR = `${MY_LISTS}${ERROR_SIGN}`;

export const BACKEND_LISTS = "/lists/";
export const BACKEND_NON_EXISTING = "/404/";

export const ADDRESSES_MEANINGS = {
  "list creation": { address: MY_LISTS, method: "POST" },
  "list removal": { address: SOME_LIST, method: "DELETE" },
  "list update": { address: SOME_LIST, method: "PATCH" },
};
export type AddressMeaning = keyof typeof ADDRESSES_MEANINGS;

export const PAGES_MEANINGS = {
  "List Creation": LISTS_CREATE,
  "My Lists": MY_LISTS,
  "My Lists with failed lists loading": LISTS_WITH_NETWORK_ERROR,
  "Latest List": SOME_LIST,
};
export type PageMeaning = keyof typeof PAGES_MEANINGS;

export const PAGE_TYPES = [LISTS_CREATE, MY_LISTS, SOME_LIST].sort();
