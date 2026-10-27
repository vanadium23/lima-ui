// Ported from features/item_updating/item_updating_content_steps.clj
// — complete.
import { And, But, Then, isEqual, type TestData } from "../../support/world.ts";
import { CONTENT } from "../../../src-ts/domain/svernik.ts";
import { createRandomString } from "../../utilities/buildRandom.ts";
import { assocInConvertedToJson, assocInPath } from "../../utilities/handleRawData.ts";
import { requestItemUpdateAndEnsureCorrectness } from "../../utilities/requestItem.ts";
import { PROVIDED_CONTENT_UPDATE } from "../../utilities/sharedConstants.ts";

And("I provide an updated content", (itemUpdateData: TestData): TestData =>
  assocInPath(itemUpdateData, ["svernikData", CONTENT], PROVIDED_CONTENT_UPDATE));

And("I provide an updated content with length: {int}", (itemUpdateData: TestData, itemContentLength: number): TestData =>
  assocInPath(itemUpdateData, ["svernikData", CONTENT], createRandomString(itemContentLength)));

Then(
  "I successfully update the item and see properly sorted updated version of it",
  async (itemUpdateData: TestData): Promise<TestData> => {
    const { auth, essence, svernikData } = itemUpdateData;
    return {
      ...itemUpdateData,
      ...(await requestItemUpdateAndEnsureCorrectness(
        (auth as { sessionToken?: string }).sessionToken,
        itemUpdateData as { id: string; svernikData: unknown },
      )),
      originalEssence: essence,
      updateData: svernikData,
    };
  },
);

Then("Updated item contains the provided content", (itemUpdateResults: TestData): TestData => {
  isEqual(
    (itemUpdateResults.updatedItem as Record<string, unknown>).content,
    PROVIDED_CONTENT_UPDATE,
    `Expected the updated item content to be ${JSON.stringify(PROVIDED_CONTENT_UPDATE)}, got ${JSON.stringify((itemUpdateResults.updatedItem as Record<string, unknown>).content)}.`,
  );
  return itemUpdateResults;
});

But("I provide an empty or incorrect content: {}", (itemUpdateData: TestData, content: string): TestData =>
  assocInConvertedToJson(itemUpdateData, ["svernikData", CONTENT], content));

And("I don't provide any updated content", (itemUpdateData: TestData): TestData => itemUpdateData);

Then("Item's content remains the same", (itemUpdateResults: TestData): TestData => {
  isEqual(
    (itemUpdateResults.originalEssence as Record<string, unknown>)[CONTENT],
    (itemUpdateResults.updatedItem as Record<string, unknown>).content,
    `Expected the item content to remain the same, got ${JSON.stringify((itemUpdateResults.updatedItem as Record<string, unknown>).content)} vs ${JSON.stringify((itemUpdateResults.originalEssence as Record<string, unknown>)[CONTENT])}.`,
  );
  return itemUpdateResults;
});
