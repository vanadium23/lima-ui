// Ported from features/item_importing/item_importing_steps.clj
// — complete.
import {
  And,
  Then,
  When,
  is,
  equalsValue,
  isEqual,
  type TestData,
} from "../../support/world.ts";
import {
  ID,
  NAME,
  PURPOSE,
} from "../../../src-ts/domain/svernik.ts";
import { parseBodyFromJson } from "../../support/http.ts";
import { isExportedTo, isSvernik } from "../../utilities/validators.ts";
import { addToItemsForUpdateOrCreation } from "../../utilities/handleItems.ts";
import {
  requestListCreation,
  requestListDeletion,
  requestListUpdateParsed,
} from "../../utilities/requestList.ts";

const TARGET_LIST_NAME_1 = "Target List for Import 1";
const TARGET_LIST_NAME_2 = "Target List for Import 2";
const TARGET_LIST_PURPOSE = "Purpose for importing other lists";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

const createTargetList = async (
  data: TestData,
  targetListName: string,
): Promise<Record<string, unknown>> => {
  const source = data.sourceList as Record<string, unknown>;
  const firstItem = (source.items as Record<string, unknown>[])[0] as Record<string, unknown>;
  const targetData = addToItemsForUpdateOrCreation(
    { [NAME]: targetListName, [PURPOSE]: TARGET_LIST_PURPOSE },
    { [ID]: firstItem.id },
  );
  const target = parseBodyFromJson(
    await requestListCreation(targetData, sessionTokenOf(data)),
  );
  isSvernik(target);
  return target as Record<string, unknown>;
};

const exportedToOf = (data: TestData): unknown => {
  const firstItem = ((data.exploredSvernik as Record<string, unknown>).items as Record<
    string,
    unknown
  >[])[0] as Record<string, unknown>;
  return firstItem.exportedTo;
};

const assertExportedToCount = (data: TestData, expectedCount: number): void => {
  const exportedTo = exportedToOf(data);
  is(
    isExportedTo(exportedTo),
    `Expected valid exported data, got: ${JSON.stringify(exportedTo)}.`,
  );
  is(
    equalsValue((exportedTo as unknown[] | null)?.length ?? 0, expectedCount),
    `Expected ${expectedCount} entries in the exported data, got ${JSON.stringify(exportedTo)}.`,
  );
};

And(
  "I create the first target list that imports the first item of the source list",
  async (data: TestData): Promise<TestData> => ({
    ...data,
    targetList1: await createTargetList(data, TARGET_LIST_NAME_1),
  }),
);

And(
  "I create the second target list that imports the first item of the source list",
  async (data: TestData): Promise<TestData> => ({
    ...data,
    targetList2: await createTargetList(data, TARGET_LIST_NAME_2),
  }),
);

Then("The first item contains exported data with both target lists", (data: TestData): TestData => {
  assertExportedToCount(data, 2);
  return data;
});

Then("The first item contains exported data with single target list", (data: TestData): TestData => {
  assertExportedToCount(data, 1);
  return data;
});

const findExportedTargetList = (data: TestData, targetListKey: string): unknown => {
  const exportedTo = (exportedToOf(data) ?? []) as Record<string, unknown>[];
  const targetList = data[targetListKey] as Record<string, unknown>;
  return exportedTo.find((entry) => entry.id === targetList.id);
};

Then("I see first target list in item's exported data", (data: TestData): TestData => {
  const exported = findExportedTargetList(data, "targetList1") as
    | Record<string, unknown>
    | undefined;
  isEqual(
    exported?.name,
    TARGET_LIST_NAME_1,
    `Expected the first target list (name ${JSON.stringify(TARGET_LIST_NAME_1)}) in the item's exported data, got ${JSON.stringify(exported)}.`,
  );
  return data;
});

Then("I do not see first target list in item's exported data", (data: TestData): TestData => {
  const exported = findExportedTargetList(data, "targetList1");
  is(
    exported === undefined || exported === null,
    `Expected the first target list to be absent from the item's exported data, got ${JSON.stringify(exported)}.`,
  );
  return data;
});

Then("I see second target list in item's exported data", (data: TestData): TestData => {
  const exported = findExportedTargetList(data, "targetList2") as
    | Record<string, unknown>
    | undefined;
  isEqual(
    exported?.name,
    TARGET_LIST_NAME_2,
    `Expected the second target list (name ${JSON.stringify(TARGET_LIST_NAME_2)}) in the item's exported data, got ${JSON.stringify(exported)}.`,
  );
  return data;
});

const parseExpectedBoolean = (expectedValue: string): boolean => expectedValue === "true";

Then("The original list has exported items property equal to {word}", (data: TestData, expectedValue: string): TestData => {
  const exploredList = data.exploredList as Record<string, unknown>;
  is(
    equalsValue(exploredList.hasExportedItems, parseExpectedBoolean(expectedValue)),
    `Expected hasExportedItems to be ${expectedValue}, got ${JSON.stringify(exploredList.hasExportedItems)}.`,
  );
  return data;
});

When("I remove all imports from the prepared lists", async (data: TestData): Promise<TestData> => {
  for (const list of (data.preparedLists ?? []) as Record<string, unknown>[]) {
    await requestListUpdateParsed(sessionTokenOf(data), list.id as string, {
      items: [{ content: "Updated item" }],
      noDocumentedReasonForLatestUpdate: true,
    });
  }
  return data;
});

When("I delete all prepared lists", async (data: TestData): Promise<TestData> => {
  for (const list of (data.preparedLists ?? []) as Record<string, unknown>[]) {
    await requestListDeletion(sessionTokenOf(data), list.id as string, null);
  }
  return data;
});

Then("The original lists have exported items property equal to {word}", (data: TestData, expectedValue: string): TestData => {
  const expectedBool = parseExpectedBoolean(expectedValue);
  for (const list of (data.preparedLists ?? []) as Record<string, unknown>[]) {
    is(
      equalsValue(list.hasExportedItems, expectedBool),
      `Expected hasExportedItems to be ${expectedValue}, got ${JSON.stringify(list.hasExportedItems)}.`,
    );
  }
  return data;
});
