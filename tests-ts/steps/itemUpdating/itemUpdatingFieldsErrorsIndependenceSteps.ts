// Ported from
// features/item_updating/item_updating_fields_errors_independence_steps.clj
// — complete.
import { Then, equalsValue, is, type TestData } from "../../support/world.ts";
import { isErrors } from "../../utilities/validators.ts";

Then("I see the set of following errors in the exact order: {string}", (itemFailedActionsAttemptData: TestData, errorMessagesTypes: string): TestData => {
  // The Examples cells are JSON arrays of error ids (donor edn/read-string).
  const expected = JSON.parse(errorMessagesTypes) as string[];
  for (const failedActionAttempt of itemFailedActionsAttemptData.failedActionsAttempt as unknown[]) {
    isErrors(failedActionAttempt);
    const actual = (failedActionAttempt as { errors: { id: string }[] }).errors.map(
      (error) => error.id,
    );
    is(
      equalsValue(actual, expected),
      `Expected the error ids ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`,
    );
  }
  return itemFailedActionsAttemptData;
});
