// Ported from features/svernik_updating/
// svernik_updating_old_data_preservation_steps.clj — complete.
import { Then, equalsValue, is, type TestData } from "../../support/world.ts";
import {
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE,
  REASON_FOR_LATEST_UPDATE,
} from "../../../src-ts/domain/svernik.ts";
import { keywordizeEssence } from "../../utilities/handleRawData.ts";
import { subtractMap } from "../../utilities/mapsOperations.ts";
import { SVERNIK_USER_PROVIDED_KEYWORDS } from "../../utilities/validators.ts";
import { isAllUserProvidedKeywordsCovered } from "../../utilities/ensureUserProvidedKeywordsCoverage.ts";
import { iteratePossibleUpdateVariations } from "../../utilities/iterateItemsAndVariations.ts";
import { requestListUpdateAndEnsureCorrectness } from "../../utilities/requestList.ts";
import {
  PROVIDED_CORRECT_ITEMS,
  PROVIDED_NAME_UPDATE,
  PROVIDED_NOTE_UPDATE,
  PROVIDED_PURPOSE_UPDATE,
} from "../../utilities/sharedConstants.ts";

const SVERNIK_USER_PROVIDED_KEYWORDS_EXCEPT_UPDATE_REASON =
  SVERNIK_USER_PROVIDED_KEYWORDS.filter(
    (keyword) =>
      keyword !== REASON_FOR_LATEST_UPDATE &&
      keyword !== NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE,
  );

const selectKeys = (
  someMap: Record<string, unknown>,
  keys: readonly string[],
): Record<string, unknown> => {
  const selected: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in someMap) {
      selected[key] = someMap[key];
    }
  }
  return selected;
};

// possible-updates: each single-field update map (keywordize-essence of
// the correct items is the identity here — fresh copies). The coverage
// check takes the donor's vector shape; the variation iterator expects
// the same updates merged into one map (subsets of its entries ≡
// subsets of the single-entry maps).
const POSSIBLE_UPDATES: Record<string, unknown>[] = [
  { name: PROVIDED_NAME_UPDATE },
  { purpose: PROVIDED_PURPOSE_UPDATE },
  { items: PROVIDED_CORRECT_ITEMS.map((item) => ({ ...item })) },
  { note: PROVIDED_NOTE_UPDATE },
];

const POSSIBLE_UPDATES_MAP = POSSIBLE_UPDATES.reduce<Record<string, unknown>>(
  (merged, update) => ({ ...merged, ...update }),
  {},
);

Then(
  "Despite the fields modified I successfully update the svernik and see properly sorted updated version of it",
  async (svernikUpdateData: TestData): Promise<TestData> => {
    isAllUserProvidedKeywordsCovered(
      POSSIBLE_UPDATES,
      SVERNIK_USER_PROVIDED_KEYWORDS_EXCEPT_UPDATE_REASON,
    );
    const sessionToken = (svernikUpdateData.auth as { sessionToken?: string }).sessionToken;
    return iteratePossibleUpdateVariations(
      POSSIBLE_UPDATES_MAP,
      (input) => requestListUpdateAndEnsureCorrectness(sessionToken, input),
      "preparedList",
      svernikUpdateData as unknown as {
        id: string;
        svernikData: Record<string, unknown>;
        essence: Record<string, unknown>;
      },
    ) as unknown as TestData;
  },
);

Then("I see the not modified fields remain the same", (essenceUpdateResults: TestData): TestData => {
  const updateDiffs = essenceUpdateResults.updateDiffs as Record<string, unknown>[];
  const allPossibleUpdates = essenceUpdateResults.allPossibleUpdates as Record<
    string,
    unknown
  >[];
  let previousSvernik = keywordizeEssence(
    essenceUpdateResults.originalEssence as Record<string, unknown>,
  );
  for (let index = 0; index < updateDiffs.length; index += 1) {
    const diff = selectKeys(
      updateDiffs[index]!,
      SVERNIK_USER_PROVIDED_KEYWORDS_EXCEPT_UPDATE_REASON,
    );
    const previousUntouched = subtractMap(
      selectKeys(previousSvernik, SVERNIK_USER_PROVIDED_KEYWORDS_EXCEPT_UPDATE_REASON),
      diff,
    );
    const svernik = allPossibleUpdates[index]!;
    const svernikUntouched = subtractMap(
      selectKeys(svernik, SVERNIK_USER_PROVIDED_KEYWORDS_EXCEPT_UPDATE_REASON),
      diff,
    );
    is(
      equalsValue(previousUntouched, svernikUntouched),
      `Expected the untouched fields to remain the same, got ${JSON.stringify(previousUntouched)} vs ${JSON.stringify(svernikUntouched)}.`,
    );
    previousSvernik = svernik;
  }
  return essenceUpdateResults;
});
