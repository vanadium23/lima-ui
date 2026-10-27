// Ported from features/svernik_updating/
// list_updating_with_exported_items_removal_steps.clj — complete.
import { randomInt } from "node:crypto";
import { And, But, Then, When, equalsValue, is, isEqual, type TestData } from "../../support/world.ts";
import { CONTENT, ID, ITEMS } from "../../../src-ts/domain/svernik.ts";
import { getErrorMessage } from "../../utilities/getErrorMessage.ts";
import {
  assocInConvertedToJson,
  assocInPath,
  assocInParsedFromJsonIfNotAbsent,
  fieldifyEssence,
} from "../../utilities/handleRawData.ts";
import {
  requestListItemsAdditionUpdateParsed,
} from "../../utilities/requestList.ts";

const DELETION_METHOD = "deletionMethod";
const EXPORTED_ITEMS_DELETION_METHODS = "exportedItemsDeletionMethods";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

const someNotEmpty = (value: unknown): boolean =>
  value != null && !(Array.isArray(value) && value.length === 0);

const itemsOfList = (list: Record<string, unknown>): Record<string, unknown>[] =>
  (list.items ?? []) as Record<string, unknown>[];

const preparedListsOf = (data: TestData): Record<string, unknown>[] =>
  (data.preparedLists ?? []) as Record<string, unknown>[];

And("I provide a replacement for items", (data: TestData): TestData =>
  assocInPath(data, ["svernikData", ITEMS], [{ [CONTENT]: "Replacement item content" }]));

And(
  "I provide the following exported items deletion references: {}",
  (listUpdateData: TestData, exportedItemsDeletionMethods: string): TestData =>
    assocInParsedFromJsonIfNotAbsent(
      listUpdateData,
      ["svernikData", EXPORTED_ITEMS_DELETION_METHODS],
      exportedItemsDeletionMethods,
    ),
);

But(
  "I provide several incorrect exported items deletion methods: {string}",
  (listUpdateData: TestData, incorrectExportedItemsDeletionMethods: string): TestData =>
    assocInConvertedToJson(
      listUpdateData,
      ["svernikData", EXPORTED_ITEMS_DELETION_METHODS],
      incorrectExportedItemsDeletionMethods,
    ),
);

And(
  "I provide several correct exported items deletion methods",
  (listUpdateData: TestData): TestData => {
    const current = (listUpdateData.svernikData as Record<string, unknown>)[
      EXPORTED_ITEMS_DELETION_METHODS
    ];
    const currentMethods = Array.isArray(current) ? current : [];
    return assocInPath(listUpdateData, ["svernikData", EXPORTED_ITEMS_DELETION_METHODS], [
      ...currentMethods,
      { [ID]: "item-some-id", [DELETION_METHOD]: "deletion" },
    ]);
  },
);

Then("I see the essence's id in the error message", (data: TestData): TestData => {
  const errorMessage = getErrorMessage(data as { failedActionsAttempt: unknown[] });
  const source = (data.sourceList ?? data.preparedList) as Record<string, unknown>;
  const firstItemId = itemsOfList(source)[0]!.id as string;
  is(
    errorMessage.includes(firstItemId),
    `Expected the error message to include the essence's id ${JSON.stringify(firstItemId)}, got: ${errorMessage}.`,
  );
  return data;
});

Then(
  "I see the erroneous exported items deletion method's index in the error message",
  (data: TestData): TestData => {
    const errorMessage = getErrorMessage(data as { failedActionsAttempt: unknown[] });
    const methods = (data.originalData as Record<string, unknown>)[
      EXPORTED_ITEMS_DELETION_METHODS
    ] as unknown[];
    const lastIndex = methods.length - 1;
    is(
      errorMessage.includes(`index ${lastIndex}`),
      `Expected the error message to mention "index ${lastIndex}", got: ${errorMessage}.`,
    );
    return data;
  },
);

Then(
  "I see the erroneous exported items deletion method's textual representation in the error message",
  (data: TestData): TestData => {
    const originalData = data.originalData as Record<string, unknown>;
    const lastMethod = (originalData[EXPORTED_ITEMS_DELETION_METHODS] as Record<
      string,
      unknown
    >[]).slice(-1)[0]!;
    const errorMessage = getErrorMessage(data as { failedActionsAttempt: unknown[] });
    const idFragment = `"id":${JSON.stringify(lastMethod[ID])}`;
    is(
      errorMessage.includes(idFragment),
      `Expected the error message to include ${JSON.stringify(idFragment)}, got: ${errorMessage}.`,
    );
    if (DELETION_METHOD in lastMethod) {
      const deletionMethodFragment = `"deletionMethod":${JSON.stringify(
        lastMethod[DELETION_METHOD],
      )}`;
      is(
        errorMessage.includes(deletionMethodFragment),
        `Expected the error message to include ${JSON.stringify(deletionMethodFragment)}, got: ${errorMessage}.`,
      );
    }
    return data;
  },
);

And(
  "I provide the exported items deletion method for one of the items of the original list",
  (data: TestData): TestData => {
    const items = itemsOfList(data.preparedList as Record<string, unknown>);
    const someItem = items[randomInt(items.length)]!;
    return {
      ...data,
      svernikData: {
        [EXPORTED_ITEMS_DELETION_METHODS]: [
          { [ID]: someItem.id, [DELETION_METHOD]: "deletion" },
        ],
      },
    };
  },
);

Then("I see the mentioned item remain in the updated list", (data: TestData): TestData => {
  const mentionedItemId = (
    (data.updateData as Record<string, unknown>)[EXPORTED_ITEMS_DELETION_METHODS] as Record<
      string,
      unknown
    >[]
  )[0]![ID];
  const items = itemsOfList(data.preparedList as Record<string, unknown>);
  is(
    items.some((item) => equalsValue(item.id, mentionedItemId)),
    `Expected the mentioned item ${JSON.stringify(mentionedItemId)} to remain in the updated list.`,
  );
  return data;
});

When("I want to update the original list", (data: TestData): TestData => {
  const preparedList = data.preparedList as Record<string, unknown>;
  return {
    ...data,
    id: preparedList.id,
    svernikData: {},
    essence: fieldifyEssence(preparedList),
    auth: data.auth,
  };
});

And(
  "I ensure the following number of items of the original list: {int}",
  async (data: TestData, itemsNumber: number): Promise<TestData> => {
    const preparedList = data.preparedList as Record<string, unknown>;
    const itemsDiff = itemsNumber - itemsOfList(preparedList).length;
    // (range 1 (inc items-diff)): Additional item 1..N.
    const updatedPreparedList =
      itemsDiff > 0
        ? ((await requestListItemsAdditionUpdateParsed(
            sessionTokenOf(data),
            preparedList,
            Array.from({ length: itemsDiff }, (_, index) => ({
              [CONTENT]: `Additional item ${index + 1}`,
            })),
          )).preparedList as Record<string, unknown>)
        : preparedList;
    return { ...data, preparedList: updatedPreparedList, essence: fieldifyEssence(updatedPreparedList) };
  },
);

And(
  "I delete an exported item from the original list via {string}",
  (data: TestData, deletionMethod: string): TestData => {
    const items = itemsOfList(data.preparedList as Record<string, unknown>);
    const exportedItem = items.find((item) => someNotEmpty(item.exportedTo));
    const exportedItemId = (exportedItem?.id ?? items[0]!.id) as string;
    const exportedItemContent = items.find((item) => equalsValue(item.id, exportedItemId))!
      .content;
    const remainingItems = (
      (data.svernikData as Record<string, unknown>)[ITEMS] as Record<string, unknown>[]
    ).filter((itemData) => itemData[ID] !== exportedItemId);
    return assocInPath(
      assocInPath(
        assocInPath(
          assocInPath(data, ["additionalData", "deletedExportedItemId"], exportedItemId),
          ["additionalData", "deletedExportedItemContent"],
          exportedItemContent,
        ),
        ["svernikData", ITEMS],
        remainingItems,
      ),
      ["svernikData", EXPORTED_ITEMS_DELETION_METHODS],
      [{ [ID]: exportedItemId, [DELETION_METHOD]: deletionMethod }],
    );
  },
);

And(
  "I remove two exported items from the original list: one via {string} and one via {string}",
  (
    data: TestData,
    deletionMethod1: string,
    deletionMethod2: string,
  ): TestData => {
    const items = itemsOfList(data.preparedList as Record<string, unknown>);
    const exportedIds = items
      .filter((item) => someNotEmpty(item.exportedTo))
      .map((item) => item.id);
    const idsForRemoval =
      exportedIds.length >= 2 ? exportedIds : items.map((item) => item.id);
    const [exportedId1, exportedId2] = idsForRemoval as [string, string];
    const contentOf = (id: string): unknown =>
      items.find((item) => equalsValue(item.id, id))!.content;
    const remainingItems = (
      (data.svernikData as Record<string, unknown>)[ITEMS] as Record<string, unknown>[]
    ).filter(
      (itemData) => itemData[ID] !== exportedId1 && itemData[ID] !== exportedId2,
    );
    return assocInPath(
      assocInPath(
        assocInPath(
          assocInPath(
            data,
            ["additionalData", "deletedExportedItemIdByMethod"],
            { [deletionMethod1]: exportedId1, [deletionMethod2]: exportedId2 },
          ),
          ["additionalData", "deletedExportedItemContentByMethod"],
          { [deletionMethod1]: contentOf(exportedId1), [deletionMethod2]: contentOf(exportedId2) },
        ),
        ["svernikData", ITEMS],
        remainingItems,
      ),
      ["svernikData", EXPORTED_ITEMS_DELETION_METHODS],
      [
        { [ID]: exportedId1, [DELETION_METHOD]: deletionMethod1 },
        { [ID]: exportedId2, [DELETION_METHOD]: deletionMethod2 },
      ],
    );
  },
);

Then("I do not see the deleted exported item in the original lists items", (data: TestData): TestData => {
  const deletedExportedItemId = (data.additionalData as Record<string, unknown>)
    .deletedExportedItemId;
  for (const list of preparedListsOf(data)) {
    is(
      !itemsOfList(list).some((item) => equalsValue(item.id, deletedExportedItemId)),
      `Expected the deleted exported item ${JSON.stringify(deletedExportedItemId)} to be absent from the original list items.`,
    );
  }
  return data;
});

Then(
  "I see the deleted exported item recreated in the original lists items the following number of times: {int}",
  (data: TestData, expectedTimes: number): TestData => {
    const additionalData = data.additionalData as Record<string, string>;
    const deletedContent = additionalData.deletedExportedItemContent;
    const deletedId = additionalData.deletedExportedItemId;
    for (const list of preparedListsOf(data)) {
      const recreatedItems = itemsOfList(list).filter(
        (item) => equalsValue(item.content, deletedContent),
      );
      isEqual(
        recreatedItems.length,
        expectedTimes,
        `Expected ${expectedTimes} recreated items, got ${recreatedItems.length}.`,
      );
      is(
        recreatedItems.every((item) => !equalsValue(item.id, deletedId)),
        "Expected the recreated item ids to differ from the deleted exported item id.",
      );
    }
    return data;
  },
);

Then(
  "I do not see the deleted exported item removed via {string} in the original lists items",
  (data: TestData, deletionMethod: string): TestData => {
    const deletedId = ((data.additionalData as Record<string, Record<string, string>>)
      .deletedExportedItemIdByMethod ?? {})[deletionMethod];
    for (const list of preparedListsOf(data)) {
      is(
        !itemsOfList(list).some((item) => equalsValue(item.id, deletedId)),
        `Expected the deleted exported item ${JSON.stringify(deletedId)} to be absent from the original list items.`,
      );
    }
    return data;
  },
);

Then(
  "I see the deleted exported item removed via {string} recreated in the original lists items the following number of times: {int}",
  (data: TestData, deletionMethod: string, expectedTimes: number): TestData => {
    const additionalData = data.additionalData as Record<string, Record<string, string>>;
    const deletedId = (additionalData.deletedExportedItemIdByMethod ?? {})[deletionMethod];
    const deletedContent =
      (additionalData.deletedExportedItemContentByMethod ?? {})[deletionMethod];
    for (const list of preparedListsOf(data)) {
      const recreatedItems = itemsOfList(list).filter(
        (item) => equalsValue(item.content, deletedContent),
      );
      isEqual(
        recreatedItems.length,
        expectedTimes,
        `Expected ${expectedTimes} recreated items, got ${recreatedItems.length}.`,
      );
      is(
        recreatedItems.every((item) => !equalsValue(item.id, deletedId)),
        "Expected the recreated item ids to differ from the deleted exported item id.",
      );
    }
    return data;
  },
);

Then(
  "I see that the recreated exported items removed via {string} have unique ids",
  (data: TestData, deletionMethod: string): TestData => {
    const additionalData = data.additionalData as Record<string, Record<string, string>>;
    const deletedContent =
      (additionalData.deletedExportedItemContentByMethod ?? {})[deletionMethod];
    const allRecreatedIds = preparedListsOf(data).flatMap((list) =>
      itemsOfList(list)
        .filter((item) => equalsValue(item.content, deletedContent))
        .map((item) => item.id),
    );
    isEqual(
      new Set(allRecreatedIds).size,
      allRecreatedIds.length,
      `Expected the recreated exported item ids to be unique, got ${JSON.stringify(allRecreatedIds)}.`,
    );
    return data;
  },
);

Then("I see that the recreated exported items have unique ids", (data: TestData): TestData => {
  const deletedContent = (data.additionalData as Record<string, string>)
    .deletedExportedItemContent;
  const allRecreatedIds = preparedListsOf(data).flatMap((list) =>
    itemsOfList(list)
      .filter((item) => equalsValue(item.content, deletedContent))
      .map((item) => item.id),
  );
  isEqual(
    new Set(allRecreatedIds).size,
    allRecreatedIds.length,
    `Expected the recreated exported item ids to be unique, got ${JSON.stringify(allRecreatedIds)}.`,
  );
  return data;
});
