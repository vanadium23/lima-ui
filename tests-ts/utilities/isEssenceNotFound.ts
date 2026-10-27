// utilities.is-essence-not-found, ported. The donor passes (:body
// response) — the RAW body string — to errors-properly-sorted?; here the
// raw text is response.text.
import { is, equalsValue } from "../support/world.ts";
import { parseBodyFromJson, type ApiResponse } from "../support/http.ts";
import { NOT_FOUND } from "./httpStatuses.ts";
import { errorsJsonProperlySorted } from "./properlySortedJson.ts";
import { isErrors } from "./validators.ts";

export const isEssenceNotFoundReturnFailedActionsAttempt = (
  response: ApiResponse,
): { failedActionsAttempt: unknown[] } => {
  const status = response.status;
  const essenceFailedExplorationAttempt = parseBodyFromJson(response);
  is(
    equalsValue(NOT_FOUND, status),
    `Expected HTTP ${NOT_FOUND}, got ${status}.`,
  );
  is(
    errorsJsonProperlySorted(response.text),
    `Errors JSON is not properly sorted: ${response.text}`,
  );
  isErrors(essenceFailedExplorationAttempt);
  return { failedActionsAttempt: [essenceFailedExplorationAttempt] };
};
