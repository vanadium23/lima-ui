// Ported from
// features/svernik_creating/svernik_creating_with_items_keeping_order_steps.clj
// — complete.
import { And, Then, isEqual, type TestData } from "../../support/world.ts";
import { CONTENT } from "../../../src-ts/domain/svernik.ts";
import { addToItemsForUpdateOrCreation } from "../../utilities/handleItems.ts";
import { PROVIDED_CORRECT_ITEMS } from "../../utilities/sharedConstants.ts";

And("I provide several correct items", (data: TestData): TestData =>
  addToItemsForUpdateOrCreation(
    data,
    PROVIDED_CORRECT_ITEMS as unknown as Record<string, unknown>[],
  ));

Then("Items are in the same order they are passed", (data: TestData): TestData => {
  const list = (data.preparedList ?? data) as Record<string, unknown>;
  const expectedContents = PROVIDED_CORRECT_ITEMS.map((item) => item.content);
  const actualContents = ((list.items as Record<string, unknown>[]) ?? []).map(
    (item) => item[CONTENT],
  );
  isEqual(
    expectedContents,
    actualContents,
    `Expected the items to keep the passed order ${JSON.stringify(expectedContents)}, got ${JSON.stringify(actualContents)}.`,
  );
  return data;
});
