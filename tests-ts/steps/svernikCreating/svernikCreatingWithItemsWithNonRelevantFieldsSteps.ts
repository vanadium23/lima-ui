// Ported from features/svernik_creating/
// svernik_creating_with_items_with_non_relevant_fields_steps.clj
// — complete.
import { And, Then, is, type TestData } from "../../support/world.ts";
import {
  assocSeveralInLastItem,
  getItemsPathInData,
} from "../../utilities/handleItems.ts";
import { assocInPath } from "../../utilities/handleRawData.ts";
import { mapsNotIntersecting } from "../../utilities/mapsOperations.ts";
import { PROVIDED_CORRECT_ITEMS } from "../../utilities/sharedConstants.ts";

const NON_RELEVANT_FIELDS: Record<string, unknown> = {
  someNonRelevantField: true,
  anotherNonRelevantField: "Hey Apple!",
};

And("The provided item gets several non-relevant fields", (svernikData: TestData): TestData =>
  assocSeveralInLastItem(svernikData as Record<string, unknown>, NON_RELEVANT_FIELDS) as TestData,
);

const isNoNonRelevantFieldsInItem = (item: unknown): void => {
  is(
    mapsNotIntersecting(item as Record<string, unknown>, NON_RELEVANT_FIELDS),
    `Expected the item not to reflect the non-relevant fields, got ${JSON.stringify(item)}.`,
  );
};

Then("Item doesn't reflect these non-relevant fields", (item: TestData): TestData => {
  isNoNonRelevantFieldsInItem(item);
  return item;
});

const getInPath = (data: Record<string, unknown>, path: (string | number)[]): unknown => {
  let current: unknown = data;
  for (const segment of path) {
    current = (current as Record<string, unknown> | undefined)?.[segment as string];
  }
  return current;
};

const addNonRelevantDataToSeveralLastItems = (
  numberOfLastItems: number,
  items: unknown[],
): unknown[] => {
  const firstItemsCount = items.length - numberOfLastItems;
  return [
    ...items.slice(0, firstItemsCount),
    ...items
      .slice(firstItemsCount)
      .map((item) => ({ ...(item as Record<string, unknown>), ...NON_RELEVANT_FIELDS })),
  ];
};

And("The provided items get several non-relevant fields", (svernikData: TestData): TestData => {
  const itemsPath = getItemsPathInData(svernikData as Record<string, unknown>);
  const items = (getInPath(svernikData as Record<string, unknown>, itemsPath) as unknown[]) ?? [];
  return assocInPath(
    svernikData as Record<string, unknown>,
    itemsPath,
    addNonRelevantDataToSeveralLastItems(PROVIDED_CORRECT_ITEMS.length, items),
  ) as TestData;
});

Then("Items don't reflect these non-relevant fields", (svernik: TestData): TestData => {
  const source = (svernik.preparedList ?? svernik) as Record<string, unknown>;
  for (const item of (source.items ?? []) as unknown[]) {
    isNoNonRelevantFieldsInItem(item);
  }
  return svernik;
});
