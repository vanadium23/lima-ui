// Ported from
// features/svernik_updating/svernik_updating_with_items_keeping_order_steps.clj
// — complete.
import { And, Then, isEqual, type TestData } from "../../support/world.ts";
import { ID, ITEMS } from "../../../src-ts/domain/svernik.ts";
import { doseqParallel } from "../../utilities/doseqParallel.ts";
import {
  doseqItemsAndVariations,
  isItemAndDataIdOrContentEqual,
} from "../../utilities/iterateItemsAndVariations.ts";
import { requestSeveralListUpdatesAndEnsureCorrectness } from "../../utilities/requestList.ts";

// clojure.math.combinatorics permutations: all orderings of the values,
// enumerated by index recursion (the assertion zips requests with the
// same sequence, so the enumeration order is consistent by construction).
const permutations = <T>(values: readonly T[]): T[][] => {
  if (values.length === 0) {
    return [[]];
  }
  const result: T[][] = [];
  for (let index = 0; index < values.length; index += 1) {
    const rest = [
      ...values.slice(0, index),
      ...values.slice(index + 1),
    ];
    for (const permutation of permutations(rest)) {
      result.push([values[index]!, ...permutation]);
    }
  }
  return result;
};

And("I use the already existing items as the base", (data: TestData): TestData => ({
  ...data,
  svernikData: {
    ...(data.svernikData as Record<string, unknown>),
    [ITEMS]: ((data.essence as Record<string, unknown>)[ITEMS] as Record<string, unknown>[]).map(
      (item) => ({ [ID]: item.id }),
    ),
  },
}));

Then(
  "Despite the items' order I successfully update the svernik and see properly sorted updated version of it",
  async (data: TestData): Promise<TestData> => {
    const { auth, id, svernikData } = data;
    return (await requestSeveralListUpdatesAndEnsureCorrectness(
      (auth as { sessionToken?: string } | undefined)?.sessionToken,
      id as string,
      svernikData as Record<string, unknown>,
      permutations((svernikData as Record<string, unknown>)[ITEMS] as Record<string, unknown>[]),
    )) as unknown as TestData;
  },
);

Then("Items in all updates are in the same order they are passed", (data: TestData): TestData => {
  doseqItemsAndVariations(
    data.updateResults as Record<string, unknown>[],
    data.itemsVariations as unknown[],
    (items, itemsVariation) => {
      isEqual(
        (items as unknown[]).length,
        (itemsVariation as unknown[]).length,
        "Expected the number of the updated items to equal the passed variation.",
      );
      doseqParallel(
        items as Record<string, unknown>[],
        itemsVariation as Record<string, unknown>[],
        isItemAndDataIdOrContentEqual,
      );
    },
  );
  return data;
});
