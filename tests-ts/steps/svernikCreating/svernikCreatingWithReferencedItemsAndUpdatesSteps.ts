// Ported from features/svernik_creating/
// svernik_creating_with_referenced_items_and_updates_steps.clj — complete.
import { But, Then, When, isEqual, type TestData } from "../../support/world.ts";
import { CONTENT, ID, ITEMS } from "../../../src-ts/domain/svernik.ts";
import { assocInPath } from "../../utilities/handleRawData.ts";
import {
  assocInLastItemWith,
  type AssocInMethod,
} from "../../utilities/handleItems.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import type { PayloadAccounted } from "../../utilities/payloadAccounted.ts";
import { PROVIDED_CONTENT } from "../../utilities/sharedConstants.ts";

When("I want to create a new list with referenced items", (listData: TestData): TestData => {
  const source = (listData.preparedList ?? listData) as Record<string, unknown>;
  const items = ((source.items ?? []) as Record<string, unknown>[]).map((item) => ({
    [ID]: item.id,
  }));
  // (cond-> {ITEMS ...} auth (assoc :auth auth)) — the fresh map
  // REPLACES the threading data; auth only when truthy.
  const auth = listData.auth;
  const result: TestData = auth !== undefined && auth !== null && auth !== false
    ? { [ITEMS]: items, auth }
    : { [ITEMS]: items };
  return result;
});

Then("item contains the previous content", (data: TestData): TestData => {
  const item = data.item as PayloadAccounted;
  isEssenceAccountedFieldValid(item, [CONTENT], "svernik.domain.item/content");
  const content = item.getField([CONTENT]);
  isEqual(
    content,
    PROVIDED_CONTENT,
    `Expected the previous content ${JSON.stringify(PROVIDED_CONTENT)}, got ${JSON.stringify(content)}.`,
  );
  return data;
});

But("I provide same content to the last item", (listData: TestData): TestData =>
  assocInLastItemWith(
    listData as Record<string, unknown>,
    assocInPath as AssocInMethod,
    CONTENT,
    PROVIDED_CONTENT,
  ) as TestData);
