// utilities.is-essence-id-in-error-message, ported: the id must appear
// in the first failed attempt's first error message.
import { is } from "../support/world.ts";
import { getErrorMessage } from "./getErrorMessage.ts";

export const isEssenceIdInErrorMessage = (
  failedActionsAttemptData: { failedActionsAttempt: unknown[] },
  id: string,
): void => {
  // The local improves the Cucumber failure output readability.
  const errorMessage = getErrorMessage(failedActionsAttemptData);
  is(
    errorMessage.includes(id),
    `Expected the error message to include the id ${JSON.stringify(id)}, got: ${JSON.stringify(errorMessage)}.`,
  );
};
