// Ported from features/svernik_deleting/lists_deleting_sublists_steps.clj
// — complete (the list-bulk-creation, new-list and
// original-lists-exploration steps came with earlier slices).
import { And, Then, When, is, isEqual, equalsValue, type TestData } from "../../support/world.ts";
import {
  CONTENT,
  ID,
  ITEMS,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE,
} from "../../../src-ts/domain/svernik.ts";
import {
  resolveItemsIndex,
  resolveItemsNumber,
  resolveListsQuantity,
} from "../../utilities/numberReferences.ts";
import {
  requestListCreationParsed,
  requestListExplorationParsed,
  requestListItemsAdditionUpdateParsed,
  requestListUpdateParsed,
} from "../../utilities/requestList.ts";

const sessionTokenOf = (data: TestData): string | undefined => data.auth?.sessionToken;

const preparedListsOf = (data: TestData): Record<string, unknown>[] =>
  (data.preparedLists ?? []) as Record<string, unknown>[];

const itemsOf = (list: Record<string, unknown>): Record<string, unknown>[] =>
  (list.items ?? []) as Record<string, unknown>[];

// (nth coll index): the donor would throw on an out-of-range index —
// so does this helper, instead of returning undefined.
const nth = <T>(items: T[], index: number): T => {
  const item = items[index];
  if (item === undefined) {
    throw new Error(`No item at index ${index} in ${JSON.stringify(items)}.`);
  }
  return item;
};

// Sorted-id-list comparison stands in for the donor's set= on ids.
const sameIdSets = (first: unknown[], second: unknown[]): boolean =>
  equalsValue([...first].sort(), [...second].sort());

When(
  "I create the following number of lists: {word}",
  async (data: TestData, listsNumber: string): Promise<TestData> => {
    const number = resolveListsQuantity(listsNumber);
    const lists = [];
    for (let i = 1; i <= number; i += 1) {
      const created = await requestListCreationParsed(
        {
          name: `List ${i}`,
          purpose: `Purpose ${i}`,
          items: [{ content: `Item ${i}` }],
        },
        sessionTokenOf(data),
      );
      lists.push(created.createdList);
    }
    return { ...data, preparedLists: lists };
  },
);

When("I create a new list", async (data: TestData): Promise<TestData> => {
  const created = await requestListCreationParsed(
    {
      name: "Some List",
      purpose: "Some Purpose",
      items: [{ content: "Some Item" }, { content: "Another Item" }, { content: "Third Item" }],
    },
    sessionTokenOf(data),
  );
  const preparedList = created.createdList as Record<string, unknown>;
  return { ...data, preparedList, id: preparedList.id };
});

When("I ask for the original lists", async (data: TestData): Promise<TestData> => {
  const token = sessionTokenOf(data);
  const exploredLists: Record<string, unknown>[] = [];
  for (const list of preparedListsOf(data)) {
    const result = await requestListExplorationParsed(token, list.id as string);
    exploredLists.push(result.exploredList as Record<string, unknown>);
  }
  return { ...data, preparedLists: exploredLists };
});

And("I add the original list as a sublist of all other lists", async (data: TestData): Promise<TestData> => {
  const originalListId = (data.preparedList as Record<string, unknown>).id;
  const updatedLists: Record<string, unknown>[] = [];
  for (const list of preparedListsOf(data)) {
    const result = await requestListItemsAdditionUpdateParsed(sessionTokenOf(data), list, [
      { [ID]: originalListId },
    ]);
    updatedLists.push(result.preparedList as Record<string, unknown>);
  }
  return { ...data, preparedLists: updatedLists };
});

Then("I see the affected lists information consisting of the originally created lists", (data: TestData): TestData => {
  const expectedListIds = preparedListsOf(data).map((list) => list.id);
  const affectedLists = (data.deletionResult as { affectedLists: unknown[] }).affectedLists;
  is(
    sameIdSets(expectedListIds, affectedLists),
    `Expected the affected lists to consist of the originally created lists, got ${JSON.stringify(affectedLists)}.`,
  );
  return data;
});

Then("I do not see the deleted sublist in the original lists items", (data: TestData): TestData => {
  const deletedListId = (data.preparedList as Record<string, unknown>).id;
  for (const list of preparedListsOf(data)) {
    is(
      !itemsOf(list).some((item) => equalsValue(item.id, deletedListId)),
      `Expected the deleted sublist ${JSON.stringify(deletedListId)} to be absent from the original list items.`,
    );
  }
  return data;
});

// find-matching-indexes: the indexes of the sliding windows (size =
// deleted-list items count, step 1) whose contents equal the deleted
// list's contents.
const findMatchingIndexes = (
  itemsOfDeletedList: Record<string, unknown>[],
  listItems: Record<string, unknown>[],
): number[] => {
  const deletedContents = itemsOfDeletedList.map((item) => item.content);
  const listContents = listItems.map((item) => item.content);
  const matchingIndexes: number[] = [];
  for (let start = 0; start + deletedContents.length <= listContents.length; start += 1) {
    if (equalsValue(listContents.slice(start, start + deletedContents.length), deletedContents)) {
      matchingIndexes.push(start);
    }
  }
  return matchingIndexes;
};

const findMatchingIds = (
  matchingIndexes: number[],
  itemsOfDeletedListCount: number,
  listItems: Record<string, unknown>[],
): unknown[] =>
  matchingIndexes.flatMap((matchingIndex) =>
    listItems
      .slice(matchingIndex, matchingIndex + itemsOfDeletedListCount)
      .map((item) => item.id),
  );

Then(
  "I see the deleted list items recreated in the original lists items the following number of times: {word}",
  (data: TestData, expectedTimes: string): TestData => {
    const itemsOfDeletedList = itemsOf(data.preparedList as Record<string, unknown>);
    const itemsOfDeletedListIds = new Set(itemsOfDeletedList.map((item) => item.id));
    const expectedCount = Number.parseInt(expectedTimes, 10);
    for (const list of preparedListsOf(data)) {
      const listItems = itemsOf(list);
      const matchingIndexes = findMatchingIndexes(itemsOfDeletedList, listItems);
      const matchingIds = new Set(
        findMatchingIds(matchingIndexes, itemsOfDeletedList.length, listItems),
      );
      is(
        matchingIndexes.length > 0,
        "Expected the deleted list items to be recreated in the original list items.",
      );
      is(
        [...matchingIds].every((id) => !itemsOfDeletedListIds.has(id)),
        "Expected the recreated item ids to differ from the deleted list item ids.",
      );
      isEqual(
        matchingIds.size,
        expectedCount * itemsOfDeletedList.length,
        `Expected ${expectedCount * itemsOfDeletedList.length} recreated item ids, got ${matchingIds.size}.`,
      );
    }
    return data;
  },
);

Then("I see that the recreated items have unique ids", (data: TestData): TestData => {
  const itemsOfDeletedList = itemsOf(data.preparedList as Record<string, unknown>);
  const allRecreatedIds: unknown[] = [];
  for (const list of preparedListsOf(data)) {
    const listItems = itemsOf(list);
    const matchingIndexes = findMatchingIndexes(itemsOfDeletedList, listItems);
    allRecreatedIds.push(...findMatchingIds(matchingIndexes, itemsOfDeletedList.length, listItems));
  }
  isEqual(
    new Set(allRecreatedIds).size,
    allRecreatedIds.length,
    `Expected the recreated item ids to be unique, got ${JSON.stringify(allRecreatedIds)}.`,
  );
  return data;
});

And(
  "I ensure the following number of items of the prepared lists: {word}",
  async (data: TestData, itemsNumber: string): Promise<TestData> => {
    const token = sessionTokenOf(data);
    const targetItemsCount = resolveItemsNumber(itemsNumber);
    const updatedLists: Record<string, unknown>[] = [];
    for (const list of preparedListsOf(data)) {
      const currentItems = itemsOf(list);
      const itemsDiff = targetItemsCount - currentItems.length;
      const result =
        itemsDiff > 0
          ? await requestListItemsAdditionUpdateParsed(
              token,
              list,
              // (range 1 (inc items-diff)): Additional item 1..N.
              Array.from({ length: itemsDiff }, (_, index) => ({
                [CONTENT]: `Additional item ${index + 1}`,
              })),
            )
          : await requestListUpdateParsed(token, list.id as string, {
              // The donor sends the kept items as full parsed maps; its
              // kebab-case serialization accidentally misses the backend's
              // camel-case repeat-current comparison. Id references carry
              // the same "keep as is" meaning and pass on both backends
              // (a full camelCase map is rejected with
              // reference-update-repeat-current on the Clojure backend).
              [ITEMS]: currentItems
                .slice(0, targetItemsCount)
                .map((item) => ({ [ID]: item.id })),
              [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE]: true,
            });
      updatedLists.push(result.preparedList as Record<string, unknown>);
    }
    return { ...data, preparedLists: updatedLists };
  },
);

const verifyRecreatedItem = (
  data: TestData,
  sublistIndex: string,
  targetIndex: string,
  contentsMatch: (sublistContent: unknown, targetContent: unknown) => boolean,
): TestData => {
  const sublistContent = nth(itemsOf(data.preparedList as Record<string, unknown>), resolveItemsIndex(sublistIndex)).content;
  for (const list of preparedListsOf(data)) {
    const targetItem = nth(itemsOf(list), resolveItemsIndex(targetIndex));
    is(
      contentsMatch(sublistContent, targetItem.content),
      `Expected the recreated item content check to hold at index ${targetIndex}, got ${JSON.stringify(targetItem.content)} vs ${JSON.stringify(sublistContent)}.`,
    );
  }
  return data;
};

Then(
  "I see the deleted sublist item with index {word} recreated in the original lists items with index {word}",
  (data: TestData, sublistIndex: string, targetIndex: string): TestData =>
    verifyRecreatedItem(data, sublistIndex, targetIndex, equalsValue),
);

Then(
  "I don’t see the deleted sublist item with index {word} recreated in the original lists items with index: {word}",
  (data: TestData, sublistIndex: string, targetIndex: string): TestData =>
    verifyRecreatedItem(data, sublistIndex, targetIndex, (first, second) => !equalsValue(first, second)),
);

And("I add the first list items to the original list", async (data: TestData): Promise<TestData> => {
  const firstListItems = itemsOf(nth(preparedListsOf(data), 0));
  const result = await requestListItemsAdditionUpdateParsed(
    sessionTokenOf(data),
    data.preparedList as Record<string, unknown>,
    firstListItems.map((item) => ({ [ID]: item.id })),
  );
  return { ...data, preparedList: result.preparedList };
});

And("I add the second list as a sublist of the original list", async (data: TestData): Promise<TestData> => {
  const secondList = nth(preparedListsOf(data), 1);
  const result = await requestListItemsAdditionUpdateParsed(
    sessionTokenOf(data),
    data.preparedList as Record<string, unknown>,
    [{ [ID]: secondList.id }],
  );
  return { ...data, preparedList: result.preparedList };
});

And("I add the original list as a sublist of the third list", async (data: TestData): Promise<TestData> => {
  const preparedLists = preparedListsOf(data);
  const result = await requestListItemsAdditionUpdateParsed(
    sessionTokenOf(data),
    nth(preparedLists, 2),
    [{ [ID]: (data.preparedList as Record<string, unknown>).id }],
  );
  const updatedLists = [...preparedLists];
  updatedLists[2] = result.preparedList as Record<string, unknown>;
  return { ...data, preparedLists: updatedLists };
});

Then("I see the first list items imported to the third list", (data: TestData): TestData => {
  const preparedLists = preparedListsOf(data);
  const firstListItems = itemsOf(nth(preparedLists, 0));
  const thirdListItems = itemsOf(nth(preparedLists, 2));
  is(
    firstListItems.every((firstItem) =>
      thirdListItems.some((thirdListItem) => equalsValue(thirdListItem, firstItem)),
    ),
    "Expected every first-list item to be imported into the third list.",
  );
  return data;
});

Then("I see the second list imported to the third list", (data: TestData): TestData => {
  const preparedLists = preparedListsOf(data);
  const secondListId = nth(preparedLists, 1).id;
  const thirdListItems = itemsOf(nth(preparedLists, 2));
  is(
    thirdListItems.some((item) => equalsValue(item.id, secondListId)),
    `Expected the second list ${JSON.stringify(secondListId)} among the third list items.`,
  );
  return data;
});

Then("I see the affected lists in the error", (data: TestData): TestData => {
  const expectedListIds = preparedListsOf(data).map((list) => list.id);
  for (const failedActionAttempt of (data.failedActionsAttempt ?? []) as {
    errors?: Record<string, unknown>[];
  }[]) {
    const errorWithAffectedEssences = (failedActionAttempt.errors ?? []).find((error) =>
      "affectedEssences" in error,
    );
    const affectedEssences = (errorWithAffectedEssences?.affectedEssences ?? []) as Record<
      string,
      unknown
    >[];
    const affectedListIds = affectedEssences.map((essence) => essence.id);
    is(
      sameIdSets(expectedListIds, affectedListIds),
      `Expected the affected lists in the error to be the originally created lists, got ${JSON.stringify(affectedListIds)}.`,
    );
  }
  return data;
});
