// utilities.iterate-items-and-variations, ported. The donor's
// fieldify-essence / keywordize-essence round-trips are identity here —
// JSON keys are already the fieldified camelCase names.
import { is, equalsValue } from "../support/world.ts";
import { CONTENT, ID } from "../../src-ts/domain/svernik.ts";
import { doseqParallel } from "./doseqParallel.ts";
import { fieldifyEssence, keywordizeEssence } from "./handleRawData.ts";
import { addIndexToStringsForUniqueness } from "./mapsOperations.ts";

export const doseqItemsAndVariations = (
  updateResults: Record<string, unknown>[],
  itemsVariations: unknown[],
  handleItemAndVariation: (items: unknown, itemsVariation: unknown) => void,
): void =>
  doseqParallel(
    updateResults.map((result) => result.items),
    itemsVariations,
    handleItemAndVariation,
  );

export const isItemAndDataIdOrContentEqual = (
  item: Record<string, unknown>,
  itemData: Record<string, unknown>,
): void =>
  is(
    equalsValue(item.id, itemData[ID]) ||
      equalsValue(item[CONTENT], itemData[CONTENT]),
    `Expected the item ${JSON.stringify(item)} to match the data ${JSON.stringify(itemData)} by id or content.`,
  );

// clojure.math.combinatorics subsets in binary-counting order.
const subsetsByMask = <T>(values: readonly T[]): T[][] => {
  const subsets: T[][] = [];
  for (let mask = 0; mask < 2 ** values.length; mask += 1) {
    const subset: T[] = [];
    for (let index = 0; index < values.length; index += 1) {
      if ((mask & (1 << index)) !== 0) {
        subset.push(values[index]!);
      }
    }
    subsets.push(subset);
  }
  return subsets;
};

// iterate-possible-update-variations: every non-empty combination of the
// possible updates becomes a variant merged over the svernik data, is
// sent as an update, and the corresponding updated essences are returned
// alongside the variant diffs.
export const iteratePossibleUpdateVariations = async (
  possibleUpdates: Record<string, unknown>,
  requestUpdateAndEnsureCorrectness: (input: {
    id: string;
    svernikData: Record<string, unknown>;
  }) => Promise<Record<string, unknown>>,
  updatedEssenceKey: string,
  {
    id,
    svernikData,
    essence,
  }: { id: string; svernikData: Record<string, unknown>; essence: Record<string, unknown> },
): Promise<{
  allPossibleUpdates: unknown[];
  updateDiffs: Record<string, unknown>[];
  originalEssence: Record<string, unknown>;
}> => {
  const allPossibleUpdateVariants = subsetsByMask(
    Object.entries(fieldifyEssence(possibleUpdates)),
  )
    .slice(1)
    .map((subset) => ({ ...svernikData, ...Object.fromEntries(subset) }))
    .map((variant, index) => addIndexToStringsForUniqueness(index, variant));
  const allPossibleUpdates: unknown[] = [];
  for (const variant of allPossibleUpdateVariants) {
    // Sequential awaiting keeps the donor's dorun-for-side-effects order.
    const updateResult = await requestUpdateAndEnsureCorrectness({
      id,
      svernikData: variant,
    });
    allPossibleUpdates.push(updateResult[updatedEssenceKey]);
  }
  return {
    allPossibleUpdates,
    updateDiffs: allPossibleUpdateVariants.map(keywordizeEssence),
    originalEssence: essence,
  };
};
