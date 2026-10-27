// Ported from features/item_updating/item_updating_purpose_steps.clj
// — complete.
import { And, Then, isEqual, type TestData } from "../../support/world.ts";
import { PURPOSE } from "../../../src-ts/domain/svernik.ts";
import { PROVIDED_PURPOSE_UPDATE } from "../../utilities/sharedConstants.ts";

Then("Updated item contains the provided purpose", (itemUpdateResults: TestData): TestData => {
  isEqual(
    (itemUpdateResults.updatedItem as Record<string, unknown>).purpose,
    PROVIDED_PURPOSE_UPDATE,
    `Expected the updated item purpose to be ${JSON.stringify(PROVIDED_PURPOSE_UPDATE)}, got ${JSON.stringify((itemUpdateResults.updatedItem as Record<string, unknown>).purpose)}.`,
  );
  return itemUpdateResults;
});

And("I don't provide any updated purpose", (itemUpdateData: TestData): TestData => itemUpdateData);

Then("Item's purpose remains the same", (itemUpdateResults: TestData): TestData => {
  isEqual(
    (itemUpdateResults.originalEssence as Record<string, unknown>)[PURPOSE],
    (itemUpdateResults.updatedItem as Record<string, unknown>).purpose,
    `Expected the item purpose to remain the same, got ${JSON.stringify((itemUpdateResults.updatedItem as Record<string, unknown>).purpose)} vs ${JSON.stringify((itemUpdateResults.originalEssence as Record<string, unknown>)[PURPOSE])}.`,
  );
  return itemUpdateResults;
});
