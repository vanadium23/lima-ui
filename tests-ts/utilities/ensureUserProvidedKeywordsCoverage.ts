// utilities.ensure-user-provided-keywords-coverage, ported: the flattened
// key sequence of the possible updates must equal the user-provided
// keywords (donor `=` on sequences — order matters).
import { is, equalsValue } from "../support/world.ts";

export const isAllUserProvidedKeywordsCovered = (
  possibleUpdates: Record<string, unknown>[],
  userProvidedKeywords: readonly string[],
): void => {
  const keywordsToUpdate = possibleUpdates.flatMap((update) =>
    Object.keys(update),
  );
  is(
    equalsValue(userProvidedKeywords, keywordsToUpdate),
    `Expected the update variations to cover ${JSON.stringify(userProvidedKeywords)}, got: ${JSON.stringify(keywordsToUpdate)}.`,
  );
};
