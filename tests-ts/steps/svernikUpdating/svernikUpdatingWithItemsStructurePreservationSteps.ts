// Ported from
// features/svernik_updating/svernik_updating_with_items_structure_preservation_steps.clj
// — complete.
import { And, Then, isEqual, type TestData } from "../../support/world.ts";
import { ID, ITEMS } from "../../../src-ts/domain/svernik.ts";
import { doseqParallel } from "../../utilities/doseqParallel.ts";
import { addToItemsForUpdateOrCreation } from "../../utilities/handleItems.ts";
import {
  doseqItemsAndVariations,
  isItemAndDataIdOrContentEqual,
} from "../../utilities/iterateItemsAndVariations.ts";
import { requestSeveralListUpdatesAndEnsureCorrectness } from "../../utilities/requestList.ts";

const PROVIDED_OTHER_CORRECT_ITEMS = [
  {
    content: "Who knew there could be other items?!",
    note: "Well, they should have been.",
  },
  {
    content: "All lists' content shouldn't be limited to just several items",
  },
];

// clojure.math.combinatorics subsets in binary-counting order.
const subsetsByMask = <T>(values: readonly T[]): T[][] => {
  const subsets: T[][] = [];
  for (let mask = 0; mask < 2 ** values.length; mask += 1) {
    const subset: T[] = [];
    for (let index = 0; index < values.length; index += 1) {
      if ((mask & (1 << index)) !== 0) {
        subset.push(values[index]!);
      }
    }
    subsets.push(subset);
  }
  return subsets;
};

const sharedIds = (someIds: Set<unknown>, anotherIds: Set<unknown>): Set<unknown> =>
  new Set([...someIds].filter((id) => anotherIds.has(id)));

const idsOf = (items: Record<string, unknown>[], idField: string): Set<unknown> =>
  new Set(items.map((item) => item[idField] ?? item.id));

And("I don't use the already existing items as the base", (data: TestData): TestData => data);

And("I provide several other correct items", (data: TestData): TestData =>
  addToItemsForUpdateOrCreation(data, PROVIDED_OTHER_CORRECT_ITEMS));

Then("I expect not to see the original items", (data: TestData): TestData => {
  const preparedList = data.preparedList as Record<string, unknown>;
  const originalEssence = data.originalEssence as Record<string, unknown>;
  const updatedSvernikItemsIds = idsOf(
    preparedList[ITEMS] as Record<string, unknown>[],
    "id",
  );
  const originalItemsIds = idsOf(
    originalEssence[ITEMS] as Record<string, unknown>[],
    ID,
  );
  isEqual(
    0,
    sharedIds(originalItemsIds, updatedSvernikItemsIds).size,
    "Expected no intersection between the original and the updated items' ids.",
  );
  return data;
});

And("I remove some of the existing items", (data: TestData): TestData => {
  const svernikData = data.svernikData as Record<string, unknown>;
  // subsets, rest and butlast: every non-empty, non-full combination.
  const allPossibleItemsCombinations = subsetsByMask(
    svernikData[ITEMS] as Record<string, unknown>[],
  ).slice(1, -1);
  const allPossibleItemsDeletions = allPossibleItemsCombinations.map(
    (removedItems, index) => ({
      removedItems,
      presentItems: allPossibleItemsCombinations[
        allPossibleItemsCombinations.length - 1 - index
      ],
    }),
  );
  return { ...data, allPossibleItemsDeletions };
});

Then(
  "Despite the items removed I successfully update the svernik and see properly sorted updated version of it",
  async (data: TestData): Promise<TestData> => {
    const { auth, id, svernikData, allPossibleItemsDeletions } = data;
    const updateResults = await requestSeveralListUpdatesAndEnsureCorrectness(
      (auth as { sessionToken?: string } | undefined)?.sessionToken,
      id as string,
      svernikData as Record<string, unknown>,
      (allPossibleItemsDeletions as { presentItems: Record<string, unknown>[] }[]).map(
        (deletion) => deletion.presentItems,
      ),
    );
    return {
      ...updateResults,
      itemsVariations: allPossibleItemsDeletions,
      auth,
    } as unknown as TestData;
  },
);

Then("I expect not to see the removed items", (data: TestData): TestData => {
  doseqItemsAndVariations(
    data.updateResults as Record<string, unknown>[],
    data.itemsVariations as unknown[],
    (items, itemsVariation) => {
      const presentItemsIds = idsOf(items as Record<string, unknown>[], "id");
      const removedItemsIds = idsOf(
        (itemsVariation as { removedItems: Record<string, unknown>[] }).removedItems,
        ID,
      );
      isEqual(
        0,
        sharedIds(presentItemsIds, removedItemsIds).size,
        "Expected no intersection between the present and the removed items' ids.",
      );
    },
  );
  return data;
});

Then("I see both old and new items", (data: TestData): TestData => {
  const items = (data.preparedList as Record<string, unknown>)[ITEMS] as Record<string, unknown>[];
  const originalItemsOrData = [
    ...((data.originalEssence as Record<string, unknown>)[ITEMS] as Record<string, unknown>[]),
    ...PROVIDED_OTHER_CORRECT_ITEMS,
  ];
  doseqParallel(
    items,
    originalItemsOrData as Record<string, unknown>[],
    isItemAndDataIdOrContentEqual,
  );
  return data;
});
