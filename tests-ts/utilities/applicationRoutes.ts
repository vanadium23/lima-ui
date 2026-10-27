// utilities.map-request-application-routes + utilities.public-routes,
// ported. The route table is the src-ts ROUTE_METHODS mirror of the
// Clojure all-routes — but scoped like the donor: the utility routes
// (clear-*) joined the reitit router separately and are NOT part of
// all-routes, so route-iterating steps must not see them either.
import { ROUTE_METHODS } from "../../src-ts/server.ts";
import { ROUTES } from "../../src-ts/domain/constants.ts";
import { serverUrl } from "../support/config.ts";
import { request, type ApiResponse, type RequestOptions } from "../support/http.ts";

const UTILITY_ROUTES = new Set<string>([
  ROUTES.clearListsAndItems,
  ROUTES.clearUsers,
]);

export type RouteMap = Record<string, readonly string[]>;

export const allRoutesAsMap: RouteMap = Object.fromEntries(
  ROUTE_METHODS.filter(([route]) => !UTILITY_ROUTES.has(route)),
);

const HTTP_METHODS = new Set(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);

// Donor specify-URL stripped "{list-id}" braces; the TS table spells
// the parameter ":listId" — the id-shaped literal is the kebab-case of
// the parameter name ("list-id", "item-id").
const specifyUrl = (url: string): string =>
  url.replace(/:([A-Za-z]+)/g, (_, name: string) =>
    name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  );

export interface MapRoutesOptions {
  filterRoutes?: (routes: RouteMap) => RouteMap;
  modifyUrl?: (url: string) => string;
  modifyMethods?: (methods: readonly string[]) => string[];
  requestOptions?: RequestOptions;
  handleResults?: (results: ApiResponse[]) => unknown;
}

const defaultHandleResults = (results: ApiResponse[]): unknown =>
  results.map(({ status, body }) => ({ status, body }));

export const mapRequestApplicationRoutes = async (
  options: MapRoutesOptions = {},
): Promise<unknown> => {
  const {
    filterRoutes = (routes: RouteMap) => routes,
    modifyUrl = (url: string) => url,
    modifyMethods = (methods: readonly string[]) => [...methods],
    requestOptions = {},
    handleResults = defaultHandleResults,
  } = options;
  const routes = filterRoutes(allRoutesAsMap);
  const results: ApiResponse[] = [];
  for (const [route, methods] of Object.entries(routes)) {
    const address = serverUrl() + modifyUrl(specifyUrl(route));
    for (const method of modifyMethods(methods.filter((m) => HTTP_METHODS.has(m)))) {
      results.push(await request(method, address, requestOptions));
    }
  }
  return handleResults(results);
};

export const mapRequestBodyExpectedRoutes = async (
  requestOptions: RequestOptions,
): Promise<unknown> =>
  mapRequestApplicationRoutes({
    requestOptions,
    modifyMethods: (methods) => methods.filter((m) => m === "POST" || m === "PATCH"),
  });

// utilities.public-routes: PUBLIC_ROUTES set + protected-route?.
export const PUBLIC_ROUTES = new Set<string>([
  ROUTES.home,
  ROUTES.login,
  ROUTES.verifyEmail,
  ROUTES.users,
  ROUTES.resetPassword,
  ROUTES.confirmResetPassword,
]);

export const isProtectedRoute = (url: string): boolean => !PUBLIC_ROUTES.has(url);
