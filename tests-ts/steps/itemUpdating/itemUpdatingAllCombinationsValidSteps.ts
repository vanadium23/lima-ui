// Ported from
// features/item_updating/item_updating_all_combinations_valid_steps.clj
// — complete.
import { Then, type TestData } from "../../support/world.ts";
import { isAllUserProvidedKeywordsCovered } from "../../utilities/ensureUserProvidedKeywordsCoverage.ts";
import { iteratePossibleUpdateVariations } from "../../utilities/iterateItemsAndVariations.ts";
import { requestItemUpdateAndEnsureCorrectness } from "../../utilities/requestItem.ts";
import {
  PROVIDED_CONTENT_UPDATE,
  PROVIDED_NOTE_UPDATE,
  PROVIDED_PURPOSE_UPDATE,
  PROVIDED_REASON_FOR_LATEST_UPDATE,
} from "../../utilities/sharedConstants.ts";
import { ITEM_USER_PROVIDED_KEYWORDS } from "../../utilities/validators.ts";

const POSSIBLE_UPDATES: Record<string, unknown>[] = [
  { content: PROVIDED_CONTENT_UPDATE },
  { purpose: PROVIDED_PURPOSE_UPDATE },
  { reasonForLatestUpdate: PROVIDED_REASON_FOR_LATEST_UPDATE },
  { note: PROVIDED_NOTE_UPDATE },
];

Then(
  "Despite the fields modified I successfully update the item and see properly sorted updated version of it",
  async (itemUpdateData: TestData): Promise<unknown> => {
    isAllUserProvidedKeywordsCovered(POSSIBLE_UPDATES, ITEM_USER_PROVIDED_KEYWORDS);
    const { auth, id, svernikData, essence } = itemUpdateData;
    return iteratePossibleUpdateVariations(
      // The donor merges the per-field update maps before iterating the
      // combinations over them.
      Object.assign({}, ...POSSIBLE_UPDATES),
      (update) =>
        requestItemUpdateAndEnsureCorrectness(
          (auth as { sessionToken?: string }).sessionToken,
          update,
        ),
      "updatedItem",
      {
        id: id as string,
        svernikData: svernikData as Record<string, unknown>,
        essence: essence as Record<string, unknown>,
      },
    );
  },
);
