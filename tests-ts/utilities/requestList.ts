// utilities.request-list, ported completely. The donor's *-JSON result
// fields hold the RAW response text (clj-http :body is a string) — the
// properly-sorted checks run on that text, the *-parsed fields hold the
// parsed body.
import { request, parseBodyFromJson, type ApiResponse } from "../support/http.ts";
import { is, equalsValue } from "../support/world.ts";
import { listRoute, listsRoute } from "./routes.ts";
import {
  ID,
  ITEMS,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE,
} from "../../src-ts/domain/svernik.ts";
import { essenceJsonProperlySorted } from "./properlySortedJson.ts";
import { isSvernik } from "./validators.ts";
import { attemptToHandleEssenceReturnStatusAndErrors } from "./requestEssence.ts";
import { addToItemsForUpdateOrCreation } from "./handleItems.ts";

export interface CreatedList {
  status: number;
  createdListJson: string;
  createdList: Record<string, unknown> | null;
  response: ApiResponse;
}

export type ListActionResult = Record<string, unknown>;

type ListAction = (
  token: string | undefined,
  id: string | null,
  listData: unknown,
) => Promise<ApiResponse>;

// request-list-action-parsed: performs the action, then renames the
// result keys per the donor's rename maps (e.g. action-result-JSON →
// explored-list-JSON).
const requestListActionParsed = async (
  actOnList: ListAction,
  id: string | null,
  listData: unknown,
  keyRenameMap: Record<string, string>,
  token?: string,
): Promise<ListActionResult> => {
  const actionResult = await actOnList(token, id, listData);
  const result: ListActionResult = {
    status: actionResult.status,
    actionResultJson: actionResult.text,
    actionResultParsed: parseBodyFromJson(actionResult),
    response: actionResult,
  };
  for (const [donorKey, renamedKey] of Object.entries(keyRenameMap)) {
    result[renamedKey] = result[donorKey]!;
    delete result[donorKey];
  }
  return result;
};

// ---- exploration --------------------------------------------------------

export const requestListExploration = (
  token: string | undefined,
  id: string,
): Promise<ApiResponse> => request("GET", listRoute(id), { token });

export const requestListExplorationParsed = (
  token: string | undefined,
  id: string,
): Promise<ListActionResult> =>
  requestListActionParsed(
    (actionToken, actionId) => requestListExploration(actionToken, actionId!),
    id,
    null,
    {
      actionResultJson: "exploredListJson",
      actionResultParsed: "exploredList",
    },
    token,
  );

export const requestAllListsExplorationParsed = (
  token: string,
): Promise<ListActionResult> =>
  requestListActionParsed(
    (actionToken) => request("GET", listsRoute(), { token: actionToken }),
    null,
    null,
    {
      actionResultJson: "exploredListsJson",
      actionResultParsed: "exploredLists",
    },
    token,
  );

export const deprecatedRequestListExplorationParsed = async (
  token: string | undefined,
  id: string,
): Promise<unknown> => parseBodyFromJson(await requestListExploration(token, id));

// ---- creation -----------------------------------------------------------

export const requestListCreation = (
  listData: unknown,
  token?: string,
): Promise<ApiResponse> =>
  request("POST", listsRoute(), { body: listData, token });

export const requestListCreationParsed = async (
  listData: unknown,
  token?: string,
): Promise<CreatedList> => {
  const response = await requestListCreation(listData, token);
  return {
    status: response.status,
    createdListJson: response.text,
    createdList: parseBodyFromJson(response) as Record<string, unknown> | null,
    response,
  };
};

// ---- update -------------------------------------------------------------

export const requestListBasedDataListUpdate = (
  token: string | undefined,
  id: string,
  listData: unknown,
): Promise<ApiResponse> =>
  request("PATCH", listRoute(id), { body: listData, token });

export const requestListUpdateParsed = (
  token: string | undefined,
  id: string,
  listUpdateData: unknown,
): Promise<ListActionResult> =>
  requestListActionParsed(
    (actionToken, actionId, actionData) =>
      requestListBasedDataListUpdate(actionToken, actionId!, actionData),
    id,
    listUpdateData,
    {
      actionResultJson: "updatedSvernikJson",
      actionResultParsed: "preparedList",
    },
    token,
  );

export const requestListItemsAdditionUpdateParsed = async (
  token: string | undefined,
  list: Record<string, unknown>,
  itemsData: unknown[],
): Promise<ListActionResult> => {
  const itemsWithIdsOnly = (list.items as Record<string, unknown>[]).map(
    (item) => ({ [ID]: item.id }),
  );
  const updateData = addToItemsForUpdateOrCreation(
    { [ITEMS]: itemsWithIdsOnly },
    itemsData,
  );
  const result = await requestListUpdateParsed(
    token,
    list.id as string,
    {
      ...updateData,
      [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE]: true,
    },
  );
  return result;
};

export const requestListUpdateAndEnsureCorrectness = async (
  token: string | undefined,
  listUpdateData: { id: string; svernikData: unknown },
): Promise<{ status: number; preparedList: unknown }> => {
  const result = await requestListUpdateParsed(
    token,
    listUpdateData.id,
    listUpdateData.svernikData,
  );
  const updatedSvernikJson = result.updatedSvernikJson as string;
  is(
    essenceJsonProperlySorted(updatedSvernikJson),
    `Updated svernik JSON is not properly sorted: ${updatedSvernikJson}`,
  );
  isSvernik(result.preparedList);
  return { status: result.status as number, preparedList: result.preparedList };
};

export const requestSeveralListUpdatesAndEnsureCorrectness = async (
  token: string | undefined,
  id: string,
  update: Record<string, unknown>,
  itemsVariations: unknown[][],
): Promise<{
  status: number;
  itemsVariations: unknown[][];
  updateResults: unknown[];
}> => {
  const updateResults: { status: number; preparedList: unknown }[] = [];
  for (const itemsVariation of itemsVariations) {
    updateResults.push(
      await requestListUpdateAndEnsureCorrectness(token, {
        id,
        svernikData: { ...update, [ITEMS]: itemsVariation },
      }),
    );
  }
  const statuses = new Set(updateResults.map((result) => result.status));
  is(
    equalsValue(statuses.size, 1),
    `Expected a single status across list updates, got: ${JSON.stringify([...statuses])}.`,
  );
  return {
    status: updateResults[0]!.status,
    itemsVariations,
    updateResults: updateResults.map((result) => result.preparedList),
  };
};

export const attemptToUpdateListReturnStatusAndErrors = async (
  token: string | undefined,
  id: string,
  update: unknown,
): Promise<ReturnType<typeof attemptToHandleEssenceReturnStatusAndErrors>> =>
  attemptToHandleEssenceReturnStatusAndErrors(
    await requestListBasedDataListUpdate(token, id, update),
  );

// ---- deletion -----------------------------------------------------------

export const requestListDeletion = (
  token: string | undefined,
  id: string,
  deletionData: unknown,
): Promise<ApiResponse> =>
  // :redirect-strategy :lax — deletion responses redirect, follow them.
  request("DELETE", listRoute(id), {
    body: deletionData ?? null,
    token,
    followRedirects: true,
  });

export const requestListDeletionParsed = (
  token: string | undefined,
  id: string,
): Promise<ListActionResult> =>
  requestListActionParsed(
    (actionToken, actionId, actionData) =>
      requestListDeletion(actionToken, actionId!, actionData),
    id,
    null,
    {
      actionResultJson: "deletionResultJson",
      actionResultParsed: "deletionResult",
    },
    token,
  );

export const requestSublistDeletionParsed = (
  token: string | undefined,
  id: string,
  deletionMethod: string,
): Promise<ListActionResult> =>
  requestListActionParsed(
    (actionToken, actionId, actionData) =>
      requestListDeletion(actionToken, actionId!, actionData),
    id,
    { deletionMethod },
    {
      actionResultJson: "deletionResultJson",
      actionResultParsed: "deletionResult",
    },
    token,
  );

export const attemptToDeleteListReturnStatusAndErrors = async (
  token: string | undefined,
  id: string,
  deletionRequestBody: unknown,
): Promise<ReturnType<typeof attemptToHandleEssenceReturnStatusAndErrors>> =>
  attemptToHandleEssenceReturnStatusAndErrors(
    await requestListDeletion(token, id, deletionRequestBody),
  );
