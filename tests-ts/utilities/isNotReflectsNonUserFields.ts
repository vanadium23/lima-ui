// utilities.is-not-reflects-non-user-fields, ported: after an update
// attempt with injected non-user fields, the updated essence must not
// reflect them — every key is either absent or holds another value.
// contains-keyword-and-not= (svernik.sverniks.utilities): (not= (get map
// keyword value) value) — an absent key yields the value itself and so
// fails the assertion.
import { is, equalsValue } from "../support/world.ts";
import { REASON_FOR_LATEST_UPDATE } from "../../src-ts/domain/svernik.ts";
import { keywordizeEssence } from "./handleRawData.ts";

const containsKeywordAndNotEqual = (
  someMap: Record<string, unknown>,
  keyword: string,
  value: unknown,
): boolean => keyword in someMap && !equalsValue(someMap[keyword], value);

export const isNotReflectsNonUserFields = (
  updateData: Record<string, unknown>,
  updatedEssence: Record<string, unknown>,
): void => {
  const { [REASON_FOR_LATEST_UPDATE]: _omitted, ...rest } = updateData;
  for (const [keyword, value] of Object.entries(keywordizeEssence(rest))) {
    is(
      containsKeywordAndNotEqual(updatedEssence, keyword, value),
      `Expected the updated essence not to reflect the non-user field ${keyword}=${JSON.stringify(value)}, got: ${JSON.stringify(updatedEssence[keyword])}.`,
    );
  }
};
