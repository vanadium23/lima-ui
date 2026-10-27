// Ported from features/list_importing/list_importing_steps.clj — complete.
import { And, Then, is, equalsValue, type TestData } from "../../support/world.ts";
import {
  CONTENT,
  EXPORTED_TO,
  ID,
  ITEMS,
  NAME,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE,
  PURPOSE,
} from "../../../src-ts/domain/svernik.ts";
import { parseBodyFromJson } from "../../support/http.ts";
import { addToItemsForUpdateOrCreation } from "../../utilities/handleItems.ts";
import {
  requestListCreation,
  requestListExplorationParsed,
  requestListUpdateParsed,
} from "../../utilities/requestList.ts";
import { PROVIDED_CONTENT } from "../../utilities/sharedConstants.ts";
import { isExportedTo, isSvernik } from "../../utilities/validators.ts";

const TARGET_LIST_NAME_1 = "Target List for Import 1";
const TARGET_LIST_NAME_1_UPDATED = "Updated Target List for Import 1";
const TARGET_LIST_NAME_2 = "Target List for Import 2";
const TARGET_LIST_PURPOSE = "Purpose for importing other lists";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

// count over the exported-to value: (count nil) is 0 in Clojure, so a
// missing collection fails the count assertion instead of crashing.
const exportedToCount = (value: unknown): number =>
  Array.isArray(value) ? value.length : 0;

const exportedEntryFor = (
  data: TestData,
  targetList: unknown,
): Record<string, unknown> | undefined =>
  ((data.exploredSvernik as Record<string, unknown>)[EXPORTED_TO] as
    | Record<string, unknown>[]
    | undefined)?.find(
    (entry) => entry.id === (targetList as Record<string, unknown>).id,
  );

const createTargetListImportingSourceList = async (
  data: TestData,
  targetName: string,
): Promise<Record<string, unknown>> => {
  const sourceList = data.sourceList as Record<string, unknown>;
  const targetData = addToItemsForUpdateOrCreation(
    { [NAME]: targetName, [PURPOSE]: TARGET_LIST_PURPOSE },
    { [ID]: sourceList.id },
  );
  const response = await requestListCreation(targetData, sessionTokenOf(data));
  const target = parseBodyFromJson(response);
  isSvernik(target);
  return target as Record<string, unknown>;
};

And("I remember this list as the source list", (data: TestData): TestData => ({
  sourceList: data.preparedList,
  auth: data.auth,
}));

And("I create the first target list that imports the source list", async (data: TestData): Promise<TestData> => ({
  ...data,
  targetList1: await createTargetListImportingSourceList(data, TARGET_LIST_NAME_1),
}));

And("I create the second target list that imports the source list", async (data: TestData): Promise<TestData> => ({
  ...data,
  targetList2: await createTargetListImportingSourceList(data, TARGET_LIST_NAME_2),
}));

And("I explore the source list", async (data: TestData): Promise<TestData> => {
  const sourceList = data.sourceList as Record<string, unknown>;
  const explorationResult = await requestListExplorationParsed(
    sessionTokenOf(data),
    sourceList.id as string,
  );
  return { ...data, exploredSvernik: explorationResult.exploredList };
});

And("I remove all imports from the first target list", async (data: TestData): Promise<TestData> => {
  const targetList1 = data.targetList1 as Record<string, unknown>;
  const updateResult = await requestListUpdateParsed(
    sessionTokenOf(data),
    targetList1.id as string,
    {
      [ITEMS]: [{ [CONTENT]: PROVIDED_CONTENT }],
      [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE]: true,
    },
  );
  return { ...data, targetList1: updateResult.preparedList };
});

const isExportedDataWithTargetCount = (data: TestData, expectedCount: number): TestData => {
  const exportedTo = (data.exploredSvernik as Record<string, unknown>)[EXPORTED_TO];
  is(
    isExportedTo(exportedTo),
    `Expected a valid exported-to collection, got: ${JSON.stringify(exportedTo)}.`,
  );
  is(
    equalsValue(exportedToCount(exportedTo), expectedCount),
    `Expected ${expectedCount} exported-to entries, got: ${JSON.stringify(exportedTo)}.`,
  );
  return data;
};

Then("List contains exported data with both target lists", (data: TestData): TestData =>
  isExportedDataWithTargetCount(data, 2));

Then("List contains exported data with single target list", (data: TestData): TestData =>
  isExportedDataWithTargetCount(data, 1));

const isExportedEntryNamed = (data: TestData, targetList: unknown, expectedName: string): void => {
  const exported = exportedEntryFor(data, targetList);
  const actualName = exported?.[NAME];
  is(
    equalsValue(actualName, expectedName),
    `Expected the exported list name ${JSON.stringify(expectedName)}, got ${JSON.stringify(actualName)}.`,
  );
};

Then("I see first target list in exported data", (data: TestData): TestData => {
  isExportedEntryNamed(data, data.targetList1, TARGET_LIST_NAME_1);
  return data;
});

Then("I do not see first target list in exported data", (data: TestData): TestData => {
  is(
    exportedEntryFor(data, data.targetList1) === undefined,
    `Expected no first target list in exported data, got: ${JSON.stringify(exportedEntryFor(data, data.targetList1))}.`,
  );
  return data;
});

Then("I see second target list in exported data", (data: TestData): TestData => {
  isExportedEntryNamed(data, data.targetList2, TARGET_LIST_NAME_2);
  return data;
});

And("I update the first target list with another name", async (data: TestData): Promise<TestData> => {
  const sourceList = data.sourceList as Record<string, unknown>;
  const targetList1 = data.targetList1 as Record<string, unknown>;
  const updateResult = await requestListUpdateParsed(
    sessionTokenOf(data),
    targetList1.id as string,
    {
      [NAME]: TARGET_LIST_NAME_1_UPDATED,
      [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE]: true,
      [ITEMS]: [{ [ID]: sourceList.id }],
    },
  );
  const updated = updateResult.preparedList;
  isSvernik(updated);
  return { ...data, targetList1: updated };
});

And("I see updated first target list in exported data", (data: TestData): TestData => {
  isExportedEntryNamed(data, data.targetList1, TARGET_LIST_NAME_1_UPDATED);
  return data;
});
