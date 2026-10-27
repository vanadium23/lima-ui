// utilities.iterate-statuses-return-bodies +
// utilities.iterate-over-errors, ported.
import { is, equalsValue } from "../support/world.ts";
import { isErrors } from "./validators.ts";

export interface StatusAndBody {
  status: number;
  body: unknown;
}

export const doseqAreStatusesAsExpectedReturnBodies = (
  statusesAndBodies: { statusesAndBodies: StatusAndBody[] },
  expectedStatus: number,
  compareStatuses: (expected: number, actual: number) => boolean = (
    expected,
    actual,
  ) => expected === actual,
): { bodies: unknown[] } => {
  const entries = statusesAndBodies.statusesAndBodies;
  for (const entry of entries) {
    is(
      compareStatuses(expectedStatus, entry.status),
      `Expected status check against ${expectedStatus}, got ${entry.status}.`,
    );
  }
  return { bodies: entries.map((entry) => entry.body ?? null) };
};

// doseq-is-failed-actions-attempt: every attempt is a valid errors
// envelope and its error ids equal the expected list (ordered or as a
// set).
export const doseqIsFailedActionsAttempt = (
  failedActionsAttempt: { failedActionsAttempt: unknown[] },
  expectedErrorsIds: string[],
): void => {
  // Clojure (doseq [attempt nil]) iterates zero times — an absent
  // :failed-actions-attempt (e.g. after an exploration step) makes the
  // check vacuous instead of throwing.
  for (const attempt of failedActionsAttempt.failedActionsAttempt ?? []) {
    isErrors(attempt);
    const actualErrorsIds = ((attempt as { errors?: { id: string }[] }).errors ?? []).map(
      (error) => error.id,
    );
    is(
      equalsValue(actualErrorsIds, expectedErrorsIds) ||
        equalsValue([...actualErrorsIds].sort(), [...expectedErrorsIds].sort()),
      `Expected error ids ${JSON.stringify(expectedErrorsIds)}, got ${JSON.stringify(actualErrorsIds)}.`,
    );
  }
};
