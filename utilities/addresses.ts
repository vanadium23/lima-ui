/* Client routing URLs */
export const URL_MY_LISTS = "/lists/";
export const URL_CREATE_LIST = `${URL_MY_LISTS}create`;

/* Test URLs */
export const TESTS_URL_SOME_LIST = `${URL_MY_LISTS}list-*`;
export const TESTS_URL_ERROR_SIGN = "?error=true";
export const TESTS_URL_LISTS_WITH_NETWORK_ERROR = `${URL_MY_LISTS}${TESTS_URL_ERROR_SIGN}`;

/* Backend routing URLs */
export const BACKEND_URL_LISTS = "/lists/";
export const BACKEND_URL_NON_EXISTING = "/404/";

export const ADDRESSES_MEANINGS = {
  "list creation": { address: URL_MY_LISTS, method: "POST" },
  "list removal": { address: TESTS_URL_SOME_LIST, method: "DELETE" },
  "list update": { address: TESTS_URL_SOME_LIST, method: "PATCH" },
};
export type AddressMeaning = keyof typeof ADDRESSES_MEANINGS;

export const PAGE_TYPES = [URL_CREATE_LIST, URL_MY_LISTS, TESTS_URL_SOME_LIST].sort();

export function getListLink(listId: string) {
  return `${URL_MY_LISTS}${listId}`;
}
