// Ported from
// features/item_updating/item_updating_reference_to_older_version_steps.clj
// — complete.
import { Then, isEqual, type TestData } from "../../support/world.ts";
import { VERSION_ID } from "../../../src-ts/domain/svernik.ts";

Then("Updated item contains the link to its older version", (itemUpdateResults: TestData): TestData => {
  isEqual(
    (itemUpdateResults.originalEssence as Record<string, unknown>)[VERSION_ID],
    (itemUpdateResults.updatedItem as Record<string, unknown>).olderVersionId,
    `Expected the updated item's older version id to equal the original version id, got ${JSON.stringify((itemUpdateResults.updatedItem as Record<string, unknown>).olderVersionId)} vs ${JSON.stringify((itemUpdateResults.originalEssence as Record<string, unknown>)[VERSION_ID])}.`,
  );
  return itemUpdateResults;
});
