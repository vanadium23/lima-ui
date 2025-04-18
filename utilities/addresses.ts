export const LISTS = "/lists/";
export const LISTS_CREATE = `${LISTS}create`;
export const SOME_LIST = `${LISTS}list-*`;
export const ERROR_SIGN = "?error=true";
export const LISTS_WITH_NETWORK_ERROR = `${LISTS}${ERROR_SIGN}`;

export const BACKEND_LISTS = "/lists/";

export const ADDRESSES_MEANINGS = {
  "list creation": { address: LISTS, method: "POST" },
  "list removal": { address: SOME_LIST, method: "DELETE" },
  "list update": { address: SOME_LIST, method: "PATCH" },
};

export type AddressMeaning = keyof typeof ADDRESSES_MEANINGS;
