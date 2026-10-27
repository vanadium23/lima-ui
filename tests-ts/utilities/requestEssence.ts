// utilities.request-essence, ported. The donor's basic-request-settings
// (:content-type :json, :throw-exceptions false) and
// prepare-essence-request-data are absorbed by support/http.ts (JSON
// content type by default, statuses never throw). The donor parses
// response strings via parse-essence-from-JSON; here bodies arrive
// pre-parsed with camelCase keys, so keywordize-essence-field is the
// identity.
import { is, equalsValue } from "../support/world.ts";
import { parseBodyFromJson, type ApiResponse } from "../support/http.ts";
import { errorsJsonProperlySorted } from "./properlySortedJson.ts";
import { isErrors } from "./validators.ts";

export interface StatusAndErrors {
  status: number;
  failedActionsAttempt: unknown[];
}

export const attemptToHandleEssenceReturnStatusAndErrors = async (
  response: ApiResponse,
): Promise<StatusAndErrors> => {
  const failedUpdateAttempt = parseBodyFromJson(response);
  is(errorsJsonProperlySorted(response.text), `Errors JSON is not properly sorted: ${response.text}`);
  isErrors(failedUpdateAttempt);
  return {
    status: response.status,
    failedActionsAttempt: [failedUpdateAttempt],
  };
};

// clojure.math.combinatorics subsets, minus the empty combination.
const subsetsWithoutEmpty = (values: readonly string[]): string[][] => {
  const subsets: string[][] = [];
  for (let mask = 1; mask < 2 ** values.length; mask += 1) {
    const subset: string[] = [];
    for (let index = 0; index < values.length; index += 1) {
      if ((mask & (1 << index)) !== 0) {
        subset.push(values[index]!);
      }
    }
    subsets.push(subset);
  }
  return subsets;
};

const selectKeys = (
  data: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> => {
  const selected: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in data) {
      selected[key] = data[key];
    }
  }
  return selected;
};

// Attempts the update with every non-empty subset of the user-provided
// fields; all attempts must fail identically (one status, one parsed
// errors envelope) and be properly sorted.
export const attemptToUpdateEssenceWithAnyCombinationOfUserProvidedFields = async (
  requestUpdate: (
    token: string | undefined,
    id: string,
    update: Record<string, unknown>,
  ) => Promise<ApiResponse>,
  userProvidedKeywords: readonly string[],
  essenceUpdateData: {
    auth?: { sessionToken?: string };
    id: string;
    svernikData: Record<string, unknown>;
  },
): Promise<StatusAndErrors> => {
  const token = essenceUpdateData.auth?.sessionToken;
  const updateResults: { status: number; failedAttemptOfAnAction: string }[] = [];
  for (const combination of subsetsWithoutEmpty(userProvidedKeywords)) {
    const response = await requestUpdate(
      token,
      essenceUpdateData.id,
      selectKeys(essenceUpdateData.svernikData, combination),
    );
    updateResults.push({
      status: response.status,
      failedAttemptOfAnAction: response.text,
    });
  }
  const statuses = new Set(updateResults.map((result) => result.status));
  const failedActionsAttempts = [
    ...new Set(updateResults.map((result) => result.failedAttemptOfAnAction)),
  ].map((rawAttempt) => JSON.parse(rawAttempt) as unknown);
  is(
    equalsValue(statuses.size, 1),
    `Expected a single status across update attempts, got: ${JSON.stringify([...statuses])}.`,
  );
  is(
    equalsValue(failedActionsAttempts.length, 1),
    `Expected a single failed-action attempt across update combinations.`,
  );
  is(
    errorsJsonProperlySorted(updateResults[0]!.failedAttemptOfAnAction),
    `Errors JSON is not properly sorted: ${updateResults[0]!.failedAttemptOfAnAction}`,
  );
  isErrors(failedActionsAttempts[0]);
  return {
    status: updateResults[0]!.status,
    failedActionsAttempt: failedActionsAttempts,
  };
};
