// Ported from features/svernik_creating/
// svernik_creating_with_items_incorrect_steps.clj — complete.
import { But, Then, type TestData } from "../../support/world.ts";
import { addParsedToItemsForUpdateOrCreation } from "../../utilities/handleItems.ts";
import { doseqIsFailedActionsAttempt } from "../../utilities/iterate.ts";

// edn/read-string over a vector-of-strings literal: commas and
// whitespace are separators, every element is a double-quoted string
// (the donor feature tables mix both separator styles).
const parseEdnStringVector = (edn: string): string[] =>
  (edn.match(/"([^"]*)"/g) ?? []).map((quoted) => quoted.slice(1, -1));

const provideParsedItems = (svernikData: TestData, itemsData: string): TestData => ({
  ...addParsedToItemsForUpdateOrCreation(
    svernikData as Record<string, unknown>,
    itemsData,
  ),
  auth: svernikData.auth,
});

But("I provide one incorrect item: {}", (svernikData: TestData, incorrectItemData: string): TestData =>
  provideParsedItems(svernikData, incorrectItemData));

But("I provide several incorrect items: {string}", (svernikData: TestData, incorrectItemsData: string): TestData =>
  provideParsedItems(svernikData, incorrectItemsData));

But("I provide several corrupt items: {string}", (svernikData: TestData, corruptItemsData: string): TestData =>
  provideParsedItems(svernikData, corruptItemsData));

Then("I see the set of following errors: {string}", (failedCreationAttemptData: TestData, errorMessagesTypes: string): TestData => {
  doseqIsFailedActionsAttempt(
    failedCreationAttemptData as unknown as { failedActionsAttempt: unknown[] },
    parseEdnStringVector(errorMessagesTypes),
  );
  return failedCreationAttemptData;
});
