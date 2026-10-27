// Ported from features/svernik_deleting/
// lists_deleting_with_exported_items_steps.clj — complete (the
// import-injection step was shared with the item_importing scenarios
// earlier; this slice adds the deletion + verification steps).
import { And, Then, is, equalsValue, type TestData } from "../../support/world.ts";
import { isDeletionResult } from "../../utilities/validators.ts";
import { deletionResultJsonProperlySorted } from "../../utilities/properlySortedJson.ts";
import {
  requestListItemsAdditionUpdateParsed,
  requestSublistDeletionParsed,
} from "../../utilities/requestList.ts";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

And("I add items from the original list to other lists", async (data: TestData): Promise<TestData> => {
  const preparedList = data.preparedList as Record<string, unknown>;
  const originalListItems = preparedList.items as Record<string, unknown>[];
  const updatedLists: Record<string, unknown>[] = [];
  for (const someList of (data.preparedLists ?? []) as Record<string, unknown>[]) {
    const result = await requestListItemsAdditionUpdateParsed(
      sessionTokenOf(data),
      someList,
      originalListItems.map((item) => ({ id: item.id })),
    );
    updatedLists.push(result.preparedList as Record<string, unknown>);
  }
  return { ...data, preparedLists: updatedLists };
});

Then(
  "I successfully delete the list with exported items via {string} and see properly sorted deletion result",
  async (data: TestData, deletionMethod: string): Promise<TestData> => {
    const preparedList = data.preparedList as Record<string, unknown>;
    const id = preparedList.id as string;
    const deletionResult = await requestSublistDeletionParsed(
      sessionTokenOf(data),
      id,
      deletionMethod,
    );
    // The donor invokes the sort check without is — its result is
    // discarded; kept call-for-call for parity.
    deletionResultJsonProperlySorted(deletionResult.deletionResultJson as string);
    isDeletionResult(deletionResult.deletionResult);
    return {
      ...data,
      status: deletionResult.status,
      deletionResult: deletionResult.deletionResult,
      id,
      originalEssence: preparedList,
    };
  },
);

Then("I do not see the deleted list items in the original lists items", (data: TestData): TestData => {
  const originalItems = (data.preparedList as Record<string, unknown>).items as Record<
    string,
    unknown
  >[];
  for (const list of (data.preparedLists ?? []) as Record<string, unknown>[]) {
    const listItems = list.items as Record<string, unknown>[];
    for (const originalItem of originalItems) {
      is(
        !listItems.some((item) => equalsValue(item.id, originalItem.id)),
        `Expected the deleted list item ${JSON.stringify(originalItem.id)} to be absent from the original list items.`,
      );
    }
  }
  return data;
});
