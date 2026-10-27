// utilities.get-error-message, ported: (:text (first (:errors (first
// failed-actions-attempt)))).
export const getErrorMessage = (
  failedActionsAttemptData: { failedActionsAttempt: unknown[] },
): string =>
  (
    (failedActionsAttemptData.failedActionsAttempt[0] as {
      errors?: { text: string }[];
    }).errors![0] as { text: string }
  ).text;
