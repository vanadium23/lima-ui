// utilities.generate-non-user-provided-fields, ported: every keyword
// outside the user-provided set gets random string data, merged UNDER
// the existing svernik data (the provided values win).
// fieldify-essence-keyword is the identity here — the keyword orders the
// suite passes around are already the fieldified camelCase names.
import { buildRandomString } from "./buildRandom.ts";

export const generateNonUserProvidedFields = (
  keywordsOrder: readonly string[],
  userProvidedKeywords: readonly string[],
  essenceRequestData: Record<string, unknown>,
): Record<string, unknown> => {
  const nonUserProvidedData: Record<string, unknown> = {};
  for (const keyword of keywordsOrder) {
    if (!userProvidedKeywords.includes(keyword)) {
      nonUserProvidedData[keyword] = buildRandomString();
    }
  }
  return {
    ...essenceRequestData,
    svernikData: {
      ...nonUserProvidedData,
      ...(essenceRequestData.svernikData as Record<string, unknown>),
    },
  };
};
