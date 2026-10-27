// Ported from features/svernik_creating/
// svernik_creating_with_referenced_items_steps.clj — complete.
import { And, But, Then, isEqual, type TestData } from "../../support/world.ts";
import { ID } from "../../../src-ts/domain/svernik.ts";
import {
  addParsedToItemsForUpdateOrCreation,
  addToItemsForUpdateOrCreation,
  assocSeveralInLastItem,
  getItemsInResults,
} from "../../utilities/handleItems.ts";
import { getParsedItem } from "../../utilities/getParsedEssences.ts";
import { getUserId } from "../../support/seed.ts";
import { PROVIDED_ID, UNAVAILABLE_ITEM_ID } from "../../utilities/sharedConstants.ts";

const PROVIDED_IDS = ["item-ordinary", "item-with-no-purpose", "item-without-note"];

const PROVIDED_ITEM_FIELDS: Record<string, unknown> = {
  content: "This content is a try to replace the original one from referenced item.",
  purpose: "It exists to show that attempts to update the item this way have no effect.",
  note: "I even don't know how this could work if this was a feature.",
};

// The donor's 1-arity get-parsed-item reads unscoped; the updating flow
// reaches "Both items..." with the bare prepared list (no auth), so the
// seeded test user stands in for the missing auth userId.
const userIdOf = async (data: TestData): Promise<string> =>
  (data.auth as { userId?: string } | undefined)?.userId ?? getUserId();

And("I provide a link to available item", (svernikData: TestData): TestData =>
  addToItemsForUpdateOrCreation(svernikData as Record<string, unknown>, {
    [ID]: PROVIDED_ID,
  }) as TestData);

Then("Item is the already existing item", async (data: TestData): Promise<TestData> => {
  // (or item data): without a picked item the whole threading data is
  // compared.
  const item = (data.item ?? data) as Record<string, unknown>;
  const expected = await getParsedItem(PROVIDED_ID, await userIdOf(data));
  isEqual(
    expected,
    item,
    `Expected the already existing item, got ${JSON.stringify(item)}.`,
  );
  return data;
});

And("I provide links to several available items", (svernikData: TestData): TestData =>
  addToItemsForUpdateOrCreation(
    svernikData as Record<string, unknown>,
    PROVIDED_IDS.map((id) => ({ [ID]: id })),
  ) as TestData);

Then("Items are the already existing items", async (svernikUpdateResults: TestData): Promise<TestData> => {
  const svernik = (svernikUpdateResults.preparedList ?? svernikUpdateResults) as Record<
    string,
    unknown
  >;
  const expected: unknown[] = [];
  for (const id of PROVIDED_IDS) {
    expected.push(await getParsedItem(id, await userIdOf(svernikUpdateResults)));
  }
  const items = (svernik.items ?? []) as unknown[];
  isEqual(
    expected,
    items.slice(-PROVIDED_IDS.length),
    `Expected the last items to be the already existing items, got ${JSON.stringify(items)}.`,
  );
  return svernikUpdateResults;
});

And("The provided item gets a content, purpose, and note", (svernikData: TestData): TestData =>
  assocSeveralInLastItem(svernikData as Record<string, unknown>, PROVIDED_ITEM_FIELDS) as TestData,
);

Then("Created svernik contains two essences", (svernik: TestData): TestData => {
  const items = (getItemsInResults(svernik as Record<string, unknown>) ?? []) as unknown[];
  isEqual(
    items.length,
    2,
    `Expected the created svernik to contain two essences, got ${JSON.stringify(items)}.`,
  );
  return svernik;
});

Then("Created svernik contains the already existing item on the first position", async (svernik: TestData): Promise<TestData> => {
  const source = (svernik.preparedList ?? svernik) as Record<string, unknown>;
  const firstItem = (source.items as unknown[])[0];
  const expected = await getParsedItem(PROVIDED_ID, await userIdOf(svernik));
  isEqual(
    expected,
    firstItem,
    `Expected the first item to be the already existing item, got ${JSON.stringify(firstItem)}.`,
  );
  return svernik;
});

Then("Both items are the already existing item and equal to each other", async (svernik: TestData): Promise<TestData> => {
  const source = (svernik.preparedList ?? svernik) as Record<string, unknown>;
  const [firstOfLastTwo, secondOfLastTwo] = (source.items as unknown[]).slice(-2);
  const expected = await getParsedItem(PROVIDED_ID, await userIdOf(svernik));
  isEqual(expected, firstOfLastTwo, "Expected the second-to-last item to be the already existing item.");
  isEqual(expected, secondOfLastTwo, "Expected the last item to be the already existing item.");
  return svernik;
});

But("I provide an empty or incorrect link to the item: {}", (svernikData: TestData, itemLink: string): TestData =>
  addToItemsForUpdateOrCreation(svernikData as Record<string, unknown>, {
    [ID]: JSON.parse(itemLink),
  }) as TestData);

But("I provide a link to the unavailable item", (svernikData: TestData): TestData =>
  addToItemsForUpdateOrCreation(svernikData as Record<string, unknown>, {
    [ID]: UNAVAILABLE_ITEM_ID,
  }) as TestData);

But("I provide links to several unavailable essences: {string}", (svernikData: TestData, unavailableEssencesData: string): TestData =>
  addParsedToItemsForUpdateOrCreation(
    svernikData as Record<string, unknown>,
    unavailableEssencesData,
  ) as TestData);
