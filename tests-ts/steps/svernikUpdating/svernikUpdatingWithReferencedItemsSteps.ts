// Ported from features/svernik_updating/svernik_updating_with_referenced_items_steps.clj
// — complete.
import { Then, is, isEqual, type TestData } from "../../support/world.ts";
import { getErrorMessage } from "../../utilities/getErrorMessage.ts";
import {
  getIndexOfLastItem,
  getItemsPathInData,
} from "../../utilities/handleItems.ts";
import { getParsedItem } from "../../utilities/getParsedEssences.ts";
import { getUserId } from "../../support/seed.ts";
import { PROVIDED_ID } from "../../utilities/sharedConstants.ts";

// The donor's 1-arity get-parsed-item reads the database unscoped; the
// updating flow reaches these steps with the bare prepared list (no
// auth), so the seeded test user stands in for the missing auth userId.
const userIdOf = async (data: TestData): Promise<string> =>
  (data.auth as { userId?: string } | undefined)?.userId ?? getUserId();

Then(
  "I see the erroneous essence's index in the error message",
  (data: TestData): TestData => {
    const errorMessage = getErrorMessage(
      data as { failedActionsAttempt: unknown[] },
    );
    const originalData = data.originalData as Record<string, unknown>;
    const index = getIndexOfLastItem(originalData, getItemsPathInData(originalData));
    is(
      errorMessage.includes(`index ${index}`),
      `Expected the error message to mention "index ${index}", got: ${errorMessage}.`,
    );
    return data;
  },
);

Then(
  "I see the erroneous essence's textual representation in the error message",
  (data: TestData): TestData => {
    const originalData = data.originalData as Record<string, unknown>;
    let items: unknown = originalData;
    for (const segment of getItemsPathInData(originalData)) {
      items = (items as Record<string, unknown> | undefined)?.[
        segment as string
      ];
    }
    const itemsList = (items as unknown[] | undefined) ?? [];
    const lastItem = itemsList[itemsList.length - 1];
    const errorMessage = getErrorMessage(
      data as { failedActionsAttempt: unknown[] },
    );
    is(
      errorMessage.includes(JSON.stringify(lastItem)),
      `Expected the error message to include ${JSON.stringify(lastItem)}, got: ${errorMessage}.`,
    );
    return data;
  },
);

Then("Updated svernik contains more than two essences", (data: TestData): TestData => {
  const preparedList = data.preparedList as Record<string, unknown>;
  const itemsCount = (preparedList.items as unknown[]).length;
  is(
    itemsCount > 2,
    `Expected the updated svernik to contain more than two essences, got ${itemsCount}.`,
  );
  return preparedList;
});

Then(
  "Updated svernik contains the already existing item on the pre-last position",
  async (updatedSvernik: TestData): Promise<TestData> => {
    const items = ((updatedSvernik as Record<string, unknown>).items ?? []) as unknown[];
    const preLastItem = items[items.length - 2];
    const expected = await getParsedItem(PROVIDED_ID, await userIdOf(updatedSvernik));
    isEqual(
      expected,
      preLastItem,
      `Expected the already existing item on the pre-last position, got ${JSON.stringify(preLastItem)}.`,
    );
    return updatedSvernik;
  },
);
