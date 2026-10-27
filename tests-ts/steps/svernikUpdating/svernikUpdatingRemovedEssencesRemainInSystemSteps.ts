// Ported from features/svernik_updating/
// svernik_updating_removed_essences_remain_in_system_steps.clj — complete.
import { And, Then, type TestData } from "../../support/world.ts";
import { ID, ITEMS, isListId } from "../../../src-ts/domain/svernik.ts";
import { requestItemExplorationParsed } from "../../utilities/requestItem.ts";
import {
  deprecatedRequestListExplorationParsed,
} from "../../utilities/requestList.ts";
import { isItem, isSvernik } from "../../utilities/validators.ts";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

// svernik.domain.essence svernik-id?: the affected essences only ever
// reference lists here.
const looksLikeSvernikData = (essenceData: Record<string, unknown>): boolean =>
  isListId(essenceData[ID]);

Then("I expect the removed items to still be in the system", async (svernikUpdateResults: TestData): Promise<TestData> => {
  const itemsVariations = svernikUpdateResults.itemsVariations as {
    removedItems: Record<string, unknown>[];
  }[];
  const removedItemsIds = [
    ...new Set(itemsVariations.flatMap((variation) => variation.removedItems).map((item) => item[ID])),
  ];
  for (const itemId of removedItemsIds) {
    isItem(await requestItemExplorationParsed(sessionTokenOf(svernikUpdateResults), itemId as string));
  }
  return svernikUpdateResults;
});

And("I remove linked svernik", (svernikAllData: TestData): TestData => {
  const itemsData = ((svernikAllData.svernikData as Record<string, unknown>)[ITEMS] ??
    []) as Record<string, unknown>[];
  const sverniksToRemove = itemsData.filter(looksLikeSvernikData);
  const itemsToKeep = itemsData.filter((itemData) => !looksLikeSvernikData(itemData));
  return {
    ...svernikAllData,
    allPossibleItemsDeletions: [{ removedItems: sverniksToRemove, presentItems: itemsToKeep }],
  };
});

Then("I expect the removed svernik to still be in the system", async (svernikUpdateResults: TestData): Promise<TestData> => {
  const itemsVariations = svernikUpdateResults.itemsVariations as {
    removedItems: Record<string, unknown>[];
  }[];
  const removedSvernikId = itemsVariations[0]!.removedItems[0]![ID] as string;
  isSvernik(
    await deprecatedRequestListExplorationParsed(
      sessionTokenOf(svernikUpdateResults),
      removedSvernikId,
    ),
  );
  return svernikUpdateResults;
});
