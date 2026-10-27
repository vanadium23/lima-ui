// utilities.request-item, ported. basic-request-settings and
// prepare-essence-request-data are absorbed by support/http.ts (JSON
// content type by default, statuses never throw); str-URL of the items
// route becomes the plain item route builder.
import { request, parseBodyFromJson, type ApiResponse } from "../support/http.ts";
import { is } from "../support/world.ts";
import { itemsRoute } from "./routes.ts";
import { essenceJsonProperlySorted } from "./properlySortedJson.ts";
import {
  attemptToHandleEssenceReturnStatusAndErrors,
  type StatusAndErrors,
} from "./requestEssence.ts";
import { isItem } from "./validators.ts";

const itemRoute = (itemId: string): string => `${itemsRoute()}/${itemId}`;

export const requestItemExploration = (
  token: string | undefined,
  id: string,
): Promise<ApiResponse> => request("GET", itemRoute(id), { token });

export const requestItemExplorationParsed = async (
  token: string | undefined,
  id: string,
): Promise<unknown> => parseBodyFromJson(await requestItemExploration(token, id));

export const requestItemHead = (
  token: string | undefined,
  id: string,
): Promise<ApiResponse> => request("HEAD", itemRoute(id), { token });

export const requestItemsHead = (token: string | undefined): Promise<ApiResponse> =>
  request("HEAD", itemsRoute(), { token });

export const requestItemUpdate = (
  token: string | undefined,
  id: string,
  itemData: unknown,
): Promise<ApiResponse> => request("PATCH", itemRoute(id), { body: itemData, token });

export const requestItemUpdateParsed = async (
  token: string | undefined,
  id: string,
  itemUpdateData: unknown,
): Promise<{ status: number; updatedItemJson: string; updatedItem: unknown }> => {
  const updateResult = await requestItemUpdate(token, id, itemUpdateData);
  return {
    status: updateResult.status,
    updatedItemJson: updateResult.text,
    updatedItem: parseBodyFromJson(updateResult),
  };
};

export const requestItemUpdateAndEnsureCorrectness = async (
  token: string | undefined,
  { id, svernikData }: { id: string; svernikData: unknown },
): Promise<{ status: number; updatedItem: unknown; item: unknown }> => {
  const { status, updatedItemJson, updatedItem } = await requestItemUpdateParsed(
    token,
    id,
    svernikData,
  );
  is(
    essenceJsonProperlySorted(updatedItemJson),
    `Updated item JSON is not properly sorted: ${updatedItemJson}`,
  );
  isItem(updatedItem);
  return { status, updatedItem, item: updatedItem };
};

// attempt-to-update-item-return-status-and-errors, both arities: the
// one-arity handles an already performed update response, the token/id
// arity performs the update first.
export const attemptToUpdateItemReturnStatusAndErrors = (
  response: ApiResponse,
): Promise<StatusAndErrors> =>
  attemptToHandleEssenceReturnStatusAndErrors(response);

export const attemptToUpdateItemReturnStatusAndErrorsById = async (
  token: string | undefined,
  id: string,
  update: unknown,
): Promise<StatusAndErrors> =>
  attemptToHandleEssenceReturnStatusAndErrors(
    await requestItemUpdate(token, id, update),
  );
