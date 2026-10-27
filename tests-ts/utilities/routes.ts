// API addresses, ported from utilities.get-local-API-address: the base
// is SERVER_URL, the route strings come from the src-ts ROUTES constant
// (itself the mirror of the Clojure route definitions).
import { ROUTES } from "../../src-ts/domain/constants.ts";
import { serverUrl } from "../support/config.ts";

const address = (route: string): string => `${serverUrl()}${route}`;

export const listsRoute = (): string => address(ROUTES.lists);
export const listRoute = (listId: string): string =>
  `${address(ROUTES.lists)}/${listId}`;
export const itemsRoute = (): string => address(ROUTES.items);
export const searchListsRoute = (): string => address(ROUTES.searchLists);
export const countListsRoute = (): string => address(ROUTES.countLists);
export const usersRoute = (): string => address(ROUTES.users);
export const profileRoute = (): string => address(ROUTES.profile);
export const loginRoute = (): string => address(ROUTES.login);
export const verifyEmailRoute = (): string => address(ROUTES.verifyEmail);
export const resetPasswordRoute = (): string => address(ROUTES.resetPassword);
export const confirmResetPasswordRoute = (): string =>
  address(ROUTES.confirmResetPassword);
export const clearListsAndItemsRoute = (): string =>
  address(ROUTES.clearListsAndItems);
export const clearUsersRoute = (): string => address(ROUTES.clearUsers);
