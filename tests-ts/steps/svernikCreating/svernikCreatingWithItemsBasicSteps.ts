// Ported from
// features/svernik_creating/svernik_creating_with_items_basic_steps.clj
// — complete.
import { And, But, Then, isEqual, type TestData } from "../../support/world.ts";
import { ITEMS } from "../../../src-ts/domain/svernik.ts";
import type { PayloadAccounted } from "../../utilities/payloadAccounted.ts";
import {
  assocInParsedFromJsonIfNotAbsent,
  assocParsedFromJsonIfNotAbsent,
} from "../../utilities/handleRawData.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import { PROVIDED_CORRECT_ITEMS } from "../../utilities/sharedConstants.ts";

// Clojure truthiness of (:svernik-data data): nil/false mean the data is
// not nested under the svernik-data key.
const hasSvernikData = (data: TestData): boolean =>
  data.svernikData !== undefined && data.svernikData !== null && data.svernikData !== false;

Then("List contains several correct items", (data: TestData): TestData => {
  const list = data as { payload?: Record<string, unknown> };
  if (list.payload !== undefined && list.payload !== null) {
    isEssenceAccountedFieldValid(
      list as unknown as PayloadAccounted,
      [ITEMS],
      "svernik.domain.svernik/items",
    );
  }
  const source = (list.payload ?? list) as Record<string, unknown>;
  isEqual(
    ((source.items as Record<string, unknown>[]) ?? []).map((item) => item.content),
    PROVIDED_CORRECT_ITEMS.map((item) => item.content),
    "Expected the list items to equal the provided correct items by content.",
  );
  return data;
});

And("I provide the following absent or empty items: {}", (data: TestData, items: string): TestData =>
  hasSvernikData(data)
    ? assocInParsedFromJsonIfNotAbsent(data, ["svernikData", ITEMS], items)
    : assocParsedFromJsonIfNotAbsent(data, ITEMS, items));

But("I provide items of incorrect type: {}", (data: TestData, items: string): TestData =>
  hasSvernikData(data)
    ? assocInParsedFromJsonIfNotAbsent(data, ["svernikData", ITEMS], items)
    : assocParsedFromJsonIfNotAbsent(data, ITEMS, items));
