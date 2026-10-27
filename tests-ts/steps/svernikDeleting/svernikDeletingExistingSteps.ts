// Ported from
// features/svernik_deleting/svernik_deleting_existing_steps.clj — complete.
import { Then, When, is, equalsValue, type TestData } from "../../support/world.ts";
import { isDeletionResult, isItem, isSvernik } from "../../utilities/validators.ts";
import { assocParsedFromJsonIfNotAbsent } from "../../utilities/handleRawData.ts";
import { deletionResultJsonProperlySorted } from "../../utilities/properlySortedJson.ts";
import { requestItemExplorationParsed } from "../../utilities/requestItem.ts";
import {
  deprecatedRequestListExplorationParsed,
  requestListDeletionParsed,
  requestListExplorationParsed,
  requestSublistDeletionParsed,
} from "../../utilities/requestList.ts";

// utilities.check-value sentinel.
const NO_VALUE_PROVIDED = "no-value-provided";

// server.utilities.svernik-raw-data-description, fieldified.
const DELETION_METHOD = "deletionMethod";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

When("I prepare created svernik for consequent actions", (data: TestData): TestData => ({
  ...data,
  preparedList: (data.preparedList ?? data) as Record<string, unknown>,
}));

Then("I successfully delete the list and see properly sorted deletion result", async (data: TestData): Promise<TestData> => {
  const preparedList = data.preparedList as Record<string, unknown>;
  const id = preparedList.id as string;
  const deletionRequestBody = data.deletionRequestBody as
    | Record<string, unknown>
    | undefined;
  const deletionMethod = deletionRequestBody
    ? (deletionRequestBody[DELETION_METHOD] ?? NO_VALUE_PROVIDED)
    : NO_VALUE_PROVIDED;
  const deletionResult =
    deletionMethod === NO_VALUE_PROVIDED
      ? await requestListDeletionParsed(sessionTokenOf(data), id)
      : await requestSublistDeletionParsed(sessionTokenOf(data), id, deletionMethod as string);
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
});

Then("I see the deleted list id in the deletion result message", (data: TestData): TestData => {
  const deletionResult = data.deletionResult as { text: string };
  is(
    deletionResult.text.includes(data.id as string),
    `Expected the deletion result message to include the id ${JSON.stringify(data.id)}, got: ${JSON.stringify(deletionResult.text)}.`,
  );
  return data;
});

Then("I see the empty list of the affected lists", (data: TestData): TestData => {
  const deletionResult = data.deletionResult as { affectedLists: unknown[] };
  is(
    equalsValue(deletionResult.affectedLists, []),
    `Expected no affected lists, got: ${JSON.stringify(deletionResult.affectedLists)}.`,
  );
  return data;
});

Then("I expect items from the deleted svernik to still be in the system", async (data: TestData): Promise<TestData> => {
  const originalEssence = data.originalEssence as Record<string, unknown>;
  for (const item of originalEssence.items as { id: string }[]) {
    isItem(await requestItemExplorationParsed(undefined, item.id));
  }
  return data;
});

Then("I expect subsverniks from the deleted svernik to still be in the system", async (data: TestData): Promise<TestData> => {
  const originalEssence = data.originalEssence as Record<string, unknown>;
  for (const subsvernik of originalEssence.items as { id: string }[]) {
    isSvernik(
      await deprecatedRequestListExplorationParsed(
        sessionTokenOf(data),
        subsvernik.id,
      ),
    );
  }
  return data;
});

When("I provide the following deletion method: {}", (data: TestData, deletionMethod: string): TestData => ({
  ...data,
  deletionRequestBody: assocParsedFromJsonIfNotAbsent({}, DELETION_METHOD, deletionMethod),
}));

When("I ask for the original list", async (data: TestData): Promise<TestData> => {
  const preparedList = data.preparedList as Record<string, unknown>;
  const result = await requestListExplorationParsed(
    sessionTokenOf(data),
    preparedList.id as string,
  );
  return {
    ...data,
    preparedList: result.exploredList,
    status: result.status,
    exploredListJson: result.exploredListJson,
    exploredList: result.exploredList,
  };
});
