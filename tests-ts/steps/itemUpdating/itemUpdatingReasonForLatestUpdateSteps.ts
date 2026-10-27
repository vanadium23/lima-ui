// Ported from
// features/item_updating/item_updating_reason_for_latest_update_steps.clj
// — complete.
import { And, Then, isEqual, type TestData } from "../../support/world.ts";
import { REASON_FOR_LATEST_UPDATE } from "../../../src-ts/domain/svernik.ts";
import { assocInPath, fieldifyEssence } from "../../utilities/handleRawData.ts";

const PROVIDED_REASON_FOR_LATEST_UPDATE_ANOTHER_VERSION =
  "I need to make some difference.";

Then("updated item contains another reason for latest update", (itemUpdateResults: TestData): TestData => {
  isEqual(
    (itemUpdateResults.updatedItem as Record<string, unknown>).reasonForLatestUpdate,
    PROVIDED_REASON_FOR_LATEST_UPDATE_ANOTHER_VERSION,
    `Expected the updated item reason for latest update to be ${JSON.stringify(PROVIDED_REASON_FOR_LATEST_UPDATE_ANOTHER_VERSION)}, got ${JSON.stringify((itemUpdateResults.updatedItem as Record<string, unknown>).reasonForLatestUpdate)}.`,
  );
  return itemUpdateResults;
});

And("I want to do item update again", (data: TestData): TestData => {
  const { auth, updatedItem } = data;
  const item = updatedItem as Record<string, unknown>;
  return {
    id: item.id,
    svernikData: {},
    essence: fieldifyEssence(item),
    auth,
  };
});

And("I provide another reason for latest update", (essenceUpdateData: TestData): TestData =>
  assocInPath(
    essenceUpdateData,
    ["svernikData", REASON_FOR_LATEST_UPDATE],
    PROVIDED_REASON_FOR_LATEST_UPDATE_ANOTHER_VERSION,
  ));
