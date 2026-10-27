// Ported from features/svernik_updating/
// list_updating_with_exported_items_deletion_steps.clj — complete.
import { And, Then, is, type TestData } from "../../support/world.ts";
import { ID, ITEMS } from "../../../src-ts/domain/svernik.ts";
import { getErrorMessage } from "../../utilities/getErrorMessage.ts";
import {
  assocInPath,
  assocParsedFromJsonIfNotAbsent,
} from "../../utilities/handleRawData.ts";

// svernik_raw_data_description raw-data keys (module-local like the
// donor's server.utilities reference).
const DELETION_METHOD = "deletionMethod";
const EXPORTED_ITEMS_DELETION_METHODS = "exportedItemsDeletionMethods";

// utilities.some-not-empty?: present AND not empty.
const someNotEmpty = (value: unknown): boolean =>
  value != null && !(Array.isArray(value) && value.length === 0);

const deletionMethodsOf = (data: TestData): Record<string, unknown>[] =>
  ((data.svernikData as Record<string, unknown>)[EXPORTED_ITEMS_DELETION_METHODS] ??
    []) as Record<string, unknown>[];

const withDeletionMethods = (
  data: TestData,
  methods: Record<string, unknown>[],
): TestData =>
  assocInPath(data, ["svernikData", EXPORTED_ITEMS_DELETION_METHODS], methods);

And(
  "I plan to delete the following number of exported items: {int}",
  (listUpdateData: TestData, itemsCount: number): TestData =>
    withDeletionMethods(
      listUpdateData,
      Array.from({ length: itemsCount }, () => ({})),
    ),
);

And(
  "I provide the following exported items deletion ids: {}",
  (listUpdateData: TestData, exportedItemsDeletionIds: string): TestData =>
    withDeletionMethods(
      listUpdateData,
      deletionMethodsOf(listUpdateData).map((method) =>
        assocParsedFromJsonIfNotAbsent(method, ID, exportedItemsDeletionIds),
      ),
    ),
);

And(
  "I provide the following exported items deletion methods: {}",
  (listUpdateData: TestData, exportedItemsDeletionMethods: string): TestData =>
    withDeletionMethods(
      listUpdateData,
      deletionMethodsOf(listUpdateData).map((method) =>
        assocParsedFromJsonIfNotAbsent(method, DELETION_METHOD, exportedItemsDeletionMethods),
      ),
    ),
);

And(
  "I provide the following exported items deletion method for method at index {int}: {}",
  (listUpdateData: TestData, index: number, deletionMethod: string): TestData => {
    const methods = [...deletionMethodsOf(listUpdateData)];
    methods[index] = assocParsedFromJsonIfNotAbsent(
      methods[index] ?? {},
      DELETION_METHOD,
      deletionMethod,
    );
    return withDeletionMethods(listUpdateData, methods);
  },
);

And(
  "I provide the deleted exported item id for all deletion methods",
  (listUpdateData: TestData): TestData => {
    const deletedId = (listUpdateData.additionalData as Record<string, unknown>)
      .deletedExportedItemId;
    return withDeletionMethods(
      listUpdateData,
      deletionMethodsOf(listUpdateData).map((method) => ({ ...method, [ID]: deletedId })),
    );
  },
);

And("I delete an exported item from the original list", (data: TestData): TestData => {
  const items = (data.preparedList as Record<string, unknown>).items as Record<
    string,
    unknown
  >[];
  const exportedItemId = items.find((item) => someNotEmpty(item.exportedTo))![ID] as string;
  const remainingItems = (
    (data.svernikData as Record<string, unknown>)[ITEMS] as Record<string, unknown>[]
  ).filter((itemData) => itemData[ID] !== exportedItemId);
  return assocInPath(
    assocInPath(data, ["additionalData", "deletedExportedItemId"], exportedItemId),
    ["svernikData", ITEMS],
    remainingItems,
  );
});

And(
  "I delete the following number of exported items from the original list: {int}",
  (data: TestData, itemsCount: number): TestData => {
    const items = (data.preparedList as Record<string, unknown>).items as Record<
      string,
      unknown
    >[];
    const exportedItems = items.filter((item) => someNotEmpty(item.exportedTo));
    const deletedIds = exportedItems.slice(0, itemsCount).map((item) => item.id);
    const remainingItems = (
      (data.svernikData as Record<string, unknown>)[ITEMS] as Record<string, unknown>[]
    ).filter((itemData) => !deletedIds.includes(itemData[ID] as string));
    return assocInPath(
      assocInPath(data, ["additionalData", "deletedExportedItemsIds"], deletedIds),
      ["svernikData", ITEMS],
      remainingItems,
    );
  },
);

Then("I see the deleted exported item id in the error message", (data: TestData): TestData => {
  const errorMessage = getErrorMessage(data as { failedActionsAttempt: unknown[] });
  const deletedExportedId = (data.additionalData as Record<string, unknown>)
    .deletedExportedItemId as string;
  is(
    errorMessage.includes(deletedExportedId),
    `Expected the error message to include the deleted exported item id ${JSON.stringify(deletedExportedId)}, got: ${errorMessage}.`,
  );
  return data;
});

Then("I see all deleted exported items ids in the error messages", (data: TestData): TestData => {
  const failedAttempt = (data.failedActionsAttempt as { errors?: { text: string }[] }[])[0]!;
  const errorMessages = (failedAttempt.errors ?? []).map((error) => error.text);
  const deletedIds = (data.additionalData as Record<string, unknown>)
    .deletedExportedItemsIds as string[];
  for (const deletedId of deletedIds) {
    is(
      errorMessages.some((message) => message.includes(deletedId)),
      `Expected some error message to include the deleted exported item id ${JSON.stringify(deletedId)}, got: ${JSON.stringify(errorMessages)}.`,
    );
  }
  return data;
});
