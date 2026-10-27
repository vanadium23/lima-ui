// Ported from features/item_updating/item_updating_note_steps.clj
// — complete.
import { And, Then, isEqual, type TestData } from "../../support/world.ts";
import { NOTE } from "../../../src-ts/domain/svernik.ts";
import { PROVIDED_NOTE_UPDATE } from "../../utilities/sharedConstants.ts";

Then("Updated item contains the provided note", (itemUpdateResults: TestData): TestData => {
  isEqual(
    (itemUpdateResults.updatedItem as Record<string, unknown>).note,
    PROVIDED_NOTE_UPDATE,
    `Expected the updated item note to be ${JSON.stringify(PROVIDED_NOTE_UPDATE)}, got ${JSON.stringify((itemUpdateResults.updatedItem as Record<string, unknown>).note)}.`,
  );
  return itemUpdateResults;
});

And("I don't provide any updated note", (itemUpdateData: TestData): TestData => itemUpdateData);

Then("Item's note remains the same", (itemUpdateResults: TestData): TestData => {
  isEqual(
    (itemUpdateResults.originalEssence as Record<string, unknown>)[NOTE],
    (itemUpdateResults.updatedItem as Record<string, unknown>).note,
    `Expected the item note to remain the same, got ${JSON.stringify((itemUpdateResults.updatedItem as Record<string, unknown>).note)} vs ${JSON.stringify((itemUpdateResults.originalEssence as Record<string, unknown>)[NOTE])}.`,
  );
  return itemUpdateResults;
});
