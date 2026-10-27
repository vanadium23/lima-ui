// Ported from
// features/item_updating/item_updating_multiple_times_steps.clj
// — complete.
import { randomInt } from "node:crypto";
import { And, Then, is, type TestData } from "../../support/world.ts";
import {
  CONTENT,
  NOTE,
  PURPOSE,
  REASON_FOR_LATEST_UPDATE,
} from "../../../src-ts/domain/svernik.ts";
import { buildRandomBoolean, buildRandomString } from "../../utilities/buildRandom.ts";
import { essenceJsonProperlySorted } from "../../utilities/properlySortedJson.ts";
import { requestItemUpdateParsed } from "../../utilities/requestItem.ts";
import { isItem } from "../../utilities/validators.ts";
import { SEEMINGLY_OKAY_LIMIT_OF_UPDATES } from "../../utilities/sharedConstants.ts";

And("I consequently update item some random number of times", async (data: TestData): Promise<TestData> => {
  const token = (data.auth as { sessionToken?: string }).sessionToken;
  const itemUpdatesResults: unknown[] = [];
  const updatesCount = randomInt(SEEMINGLY_OKAY_LIMIT_OF_UPDATES);
  for (let index = 0; index < updatesCount; index += 1) {
    const update: Record<string, unknown> = {
      [REASON_FOR_LATEST_UPDATE]: buildRandomString(),
    };
    if (buildRandomBoolean()) {
      update[CONTENT] = buildRandomString();
    }
    if (buildRandomBoolean()) {
      update[PURPOSE] = buildRandomString();
    }
    if (buildRandomBoolean()) {
      update[NOTE] = buildRandomString();
    }
    itemUpdatesResults.push(await requestItemUpdateParsed(token, data.id as string, update));
  }
  return { itemUpdatesResults };
});

Then("On any update I see properly sorted updated version of the item", (itemUpdatesResults: TestData): TestData => {
  for (const updateResult of itemUpdatesResults.itemUpdatesResults as {
    updatedItem: unknown;
    updatedItemJson: string;
  }[]) {
    is(
      essenceJsonProperlySorted(updateResult.updatedItemJson),
      `Updated item JSON is not properly sorted: ${updateResult.updatedItemJson}`,
    );
    isItem(updateResult.updatedItem);
  }
  return itemUpdatesResults;
});
