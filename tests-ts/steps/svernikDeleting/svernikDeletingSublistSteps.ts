// Ported from features/svernik_deleting/
// svernik_deleting_sublist_steps.clj — complete.
import { Then, When, is, isEqual, equalsValue, type TestData } from "../../support/world.ts";
import { ID, ITEMS } from "../../../src-ts/domain/svernik.ts";
import { addToItemsForUpdateOrCreation } from "../../utilities/handleItems.ts";
import { isDeletionResult } from "../../utilities/validators.ts";
import { deletionResultJsonProperlySorted } from "../../utilities/properlySortedJson.ts";
import {
  attemptToDeleteListReturnStatusAndErrors,
  requestListCreationParsed,
  requestListExplorationParsed,
  requestSublistDeletionParsed,
} from "../../utilities/requestList.ts";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

const previousSvernikOf = (data: TestData): Record<string, unknown> =>
  (data.additionalData as { previousSvernik: Record<string, unknown> }).previousSvernik;

When("I want to create another svernik", (data: TestData): TestData => ({
  ...data,
  svernikData: {},
  previousSvernik: data.preparedList,
}));

Then("I successfully create another properly sorted svernik", async (data: TestData): Promise<TestData> => {
  const creation = await requestListCreationParsed(data.svernikData, sessionTokenOf(data));
  return {
    ...creation,
    previousSvernik: data.previousSvernik,
    auth: data.auth,
  } as TestData;
});

Then("the last list is the required one", (data: TestData): TestData => {
  const preparedList = data.preparedList as Record<string, unknown>;
  const items = preparedList.items as Record<string, unknown>[];
  return { ...data, preparedList: items[items.length - 1] };
});

When("I add the created list as a link to the previously created one", (data: TestData): TestData => {
  const previousSvernik = previousSvernikOf(data);
  const id = previousSvernik.id as string;
  const itemsIds = ((previousSvernik.items ?? []) as Record<string, unknown>[]).map(
    (item) => ({ [ID]: item.id }),
  );
  const essence = data.essence as Record<string, unknown>;
  return {
    ...data,
    id,
    essence,
    svernikData: addToItemsForUpdateOrCreation({ [ID]: id, [ITEMS]: itemsIds }, {
      [ID]: essence[ID],
    }),
    additionalData: data.additionalData,
  };
});

Then("I see the affected lists information consisting of the originally created list", (data: TestData): TestData => {
  const deletionResult = data.deletionResult as { affectedLists: unknown[] };
  isEqual(
    [previousSvernikOf(data).id],
    deletionResult.affectedLists,
    `Expected the affected lists to consist of the originally created list, got ${JSON.stringify(deletionResult.affectedLists)}.`,
  );
  return data;
});

Then(
  "I successfully delete the sublist via {string} and see properly sorted deletion result",
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
      additionalData: data.additionalData,
    };
  },
);

When("I ask for the original list with deleted sublist", async (data: TestData): Promise<TestData> => {
  const originalListId = previousSvernikOf(data).id as string;
  const explored = await requestListExplorationParsed(sessionTokenOf(data), originalListId);
  return {
    ...data,
    id: originalListId,
    preparedList: explored.exploredList,
    additionalData: {
      ...(data.additionalData as Record<string, unknown>),
      deletedListId: data.id,
    },
  };
});

Then("I expect not to see the deleted sublist in the original list items", (data: TestData): TestData => {
  const deletedListId = (data.additionalData as { deletedListId: unknown }).deletedListId;
  const items = (data.preparedList as Record<string, unknown>).items as Record<
    string,
    unknown
  >[];
  is(
    !items.some((item) => equalsValue(item.id, deletedListId)),
    `Expected the deleted sublist ${JSON.stringify(deletedListId)} to be absent from the original list items.`,
  );
  return data;
});

Then("my attempt to delete the exported list fails", async (data: TestData): Promise<TestData> => {
  const deletionResult = await attemptToDeleteListReturnStatusAndErrors(
    sessionTokenOf(data),
    (data.preparedList as Record<string, unknown>).id as string,
    data.deletionRequestBody,
  );
  return {
    ...data,
    status: deletionResult.status,
    failedActionsAttempt: deletionResult.failedActionsAttempt,
  };
});
