// Ported from features/svernik_creating/
// svernik_creating_with_items_with_optional_fields_steps.clj —
// complete. Both donor arities of assoc-in-last-item are used: the
// 4-arity (plain assoc-in) for the plain-string constants, the
// 3-arity (JSON-parsed, absent-safe) for the {}-cell test data.
import { And, But, Then, isEqual, type TestData } from "../../support/world.ts";
import { NOTE, PURPOSE, REASON_FOR_LATEST_UPDATE } from "../../../src-ts/domain/svernik.ts";
import { assocInPath } from "../../utilities/handleRawData.ts";
import {
  assocInLastItem,
  assocInLastItemWith,
  type AssocInMethod,
} from "../../utilities/handleItems.ts";

const PROVIDED_PURPOSE =
  "To avoid the situation when you come back to your place and discover bad smell and mess.";
const PROVIDED_NOTE =
  "It's always pity to throw away unspoiled food. Sometimes you can pass it to neighbours or friends.";

And("The provided item gets a purpose", (svernikData: TestData): TestData =>
  assocInLastItemWith(
    svernikData as Record<string, unknown>,
    assocInPath as AssocInMethod,
    PURPOSE,
    PROVIDED_PURPOSE,
  ));

And("The provided item gets a note", (svernikData: TestData): TestData =>
  assocInLastItemWith(
    svernikData as Record<string, unknown>,
    assocInPath as AssocInMethod,
    NOTE,
    PROVIDED_NOTE,
  ));

// The donor returns the picked `item` here (not the threading data).
Then("item contains the provided purpose", (data: TestData): TestData => {
  const purpose = (data.item as Record<string, unknown>).purpose;
  isEqual(
    purpose,
    PROVIDED_PURPOSE,
    `Expected the provided purpose, got ${JSON.stringify(purpose)}.`,
  );
  return data.item as TestData;
});

And("The provided item gets the following absent or empty purpose: {}", (svernikData: TestData, purpose: string): TestData =>
  assocInLastItem(svernikData as Record<string, unknown>, PURPOSE, purpose) as TestData);

But("The provided item gets the following incorrect purpose: {}", (svernikData: TestData, purpose: string): TestData =>
  assocInLastItem(svernikData as Record<string, unknown>, PURPOSE, purpose) as TestData);

// ...and the threading `data` here.
Then("item contains the provided note", (data: TestData): TestData => {
  const note = (data.item as Record<string, unknown>).note;
  isEqual(
    note,
    PROVIDED_NOTE,
    `Expected the provided note, got ${JSON.stringify(note)}.`,
  );
  return data;
});

And("The provided item gets the following absent or empty note: {}", (svernikData: TestData, note: string): TestData =>
  assocInLastItem(svernikData as Record<string, unknown>, NOTE, note) as TestData);

But("The provided item gets the following incorrect note: {}", (svernikData: TestData, note: string): TestData =>
  assocInLastItem(svernikData as Record<string, unknown>, NOTE, note) as TestData);

And("The provided item gets any absent or present reason for latest update: {}", (svernikData: TestData, reasonForLatestUpdate: string): TestData =>
  assocInLastItem(
    svernikData as Record<string, unknown>,
    REASON_FOR_LATEST_UPDATE,
    reasonForLatestUpdate,
  ) as TestData);
