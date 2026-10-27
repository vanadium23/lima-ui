// Ported from
// features/svernik_creating/svernik_creating_with_optional_fields_steps.clj
// — complete.
import { And, But, Then, isEqual, type TestData } from "../../support/world.ts";
import {
  EXPORTED_TO_DEFAULT,
  HAS_EXPORTED_ITEMS_DEFAULT,
  NOTE,
  NOTE_DEFAULT,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_DEFAULT,
  PURPOSE,
  REASON_FOR_LATEST_UPDATE,
  REASON_FOR_LATEST_UPDATE_DEFAULT,
} from "../../../src-ts/domain/svernik.ts";
import type { PayloadAccounted } from "../../utilities/payloadAccounted.ts";
import { createRandomString } from "../../utilities/buildRandom.ts";
import {
  assocInParsedFromJsonIfNotAbsent,
  assocParsedFromJsonIfNotAbsent,
} from "../../utilities/handleRawData.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";

export const PROVIDED_NOTE =
  "I remember this 'wonderful' need to clean the house from several-week-wasted food.";

// Clojure truthiness of (:svernik-data data) and (:payload data).
const isPresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== false;

// (or (:prepared-list svernik) svernik) — the threading data either
// holds the prepared essence or IS the accounted record.
const svernikOf = (data: TestData): Record<string, unknown> =>
  (data.preparedList ?? data) as Record<string, unknown>;

const payloadOf = (svernik: Record<string, unknown>): Record<string, unknown> | undefined =>
  svernik.payload as Record<string, unknown> | undefined;

const provideField = (
  data: TestData,
  field: string,
  value: string,
): TestData =>
  isPresent(data.svernikData)
    ? assocInParsedFromJsonIfNotAbsent(data, ["svernikData", field], value)
    : assocParsedFromJsonIfNotAbsent(data, field, value);

And("I provide a note", (data: TestData): TestData => ({ ...data, [NOTE]: PROVIDED_NOTE }));

And("I provide a note with length: {int}", (data: TestData, noteLength: number): TestData => ({
  ...data,
  [NOTE]: createRandomString(noteLength),
}));

And("I provide the following absent or empty note: {}", (data: TestData, note: string): TestData =>
  provideField(data, NOTE, note));

And("I provide any absent or present reason for latest update: {}", (data: TestData, reasonForLatestUpdate: string): TestData =>
  provideField(data, REASON_FOR_LATEST_UPDATE, reasonForLatestUpdate));

And(
  "I provide any absent or present mark of the absence of a reason for latest update: {}",
  (data: TestData, noDocumentedReasonForLatestUpdate: string): TestData =>
    provideField(data, NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE, noDocumentedReasonForLatestUpdate),
);

Then("Svernik contains note in its default state", (data: TestData): TestData => {
  const svernik = svernikOf(data);
  const payload = payloadOf(svernik);
  if (payload !== undefined) {
    isEssenceAccountedFieldValid(
      svernik as unknown as PayloadAccounted,
      [NOTE],
      "svernik.domain.with-note/note",
    );
  }
  isEqual(
    (payload ?? svernik)[NOTE],
    NOTE_DEFAULT,
    `Expected the note in its default state (${JSON.stringify(NOTE_DEFAULT)}), got ${JSON.stringify((payload ?? svernik)[NOTE])}.`,
  );
  return svernik;
});

Then("List contains exported data in its default state", (data: TestData): TestData => {
  const list = svernikOf(data);
  const payload = payloadOf(list);
  if (payload !== undefined) {
    isEssenceAccountedFieldValid(
      list as unknown as PayloadAccounted,
      ["exportedTo"],
      "svernik.domain.with-exported-to/exported-to",
    );
    isEssenceAccountedFieldValid(
      list as unknown as PayloadAccounted,
      ["hasExportedItems"],
      "svernik.domain.svernik/has-exported-items",
    );
  }
  const source = payload ?? list;
  isEqual(
    source.exportedTo,
    EXPORTED_TO_DEFAULT,
    `Expected the exported data in its default state (${JSON.stringify(EXPORTED_TO_DEFAULT)}), got ${JSON.stringify(source.exportedTo)}.`,
  );
  isEqual(
    source.hasExportedItems,
    HAS_EXPORTED_ITEMS_DEFAULT,
    `Expected has-exported-items in its default state, got ${JSON.stringify(source.hasExportedItems)}.`,
  );
  return list;
});

Then("List contains user id", (data: TestData): TestData => {
  const list = svernikOf(data);
  if (payloadOf(list) !== undefined) {
    isEssenceAccountedFieldValid(
      list as unknown as PayloadAccounted,
      ["userId"],
      "svernik.domain.with-user-id/user-id",
    );
  }
  return list;
});

Then("Created svernik contains the provided note", (data: TestData): TestData => {
  const svernik = svernikOf(data);
  isEqual(
    svernik[NOTE],
    PROVIDED_NOTE,
    `Expected the provided note, got ${JSON.stringify(svernik[NOTE])}.`,
  );
  return svernik;
});

Then("Svernik contains reason for latest update in its default state", (data: TestData): TestData => {
  const svernik = svernikOf(data);
  const payload = payloadOf(svernik);
  if (payload !== undefined) {
    isEssenceAccountedFieldValid(
      svernik as unknown as PayloadAccounted,
      [REASON_FOR_LATEST_UPDATE],
      "svernik.domain.with-required-reasons.empty/reason-for-latest-update",
    );
  }
  isEqual(
    (payload ?? svernik)[REASON_FOR_LATEST_UPDATE],
    REASON_FOR_LATEST_UPDATE_DEFAULT,
    `Expected the reason for latest update in its default state, got ${JSON.stringify((payload ?? svernik)[REASON_FOR_LATEST_UPDATE])}.`,
  );
  return svernik;
});

Then(
  "Svernik contains mark of the absence of a reason for latest update in its default state",
  (data: TestData): TestData => {
    const svernik = svernikOf(data);
    const payload = payloadOf(svernik);
    if (payload !== undefined) {
      isEssenceAccountedFieldValid(
        svernik as unknown as PayloadAccounted,
        [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE],
        "svernik.domain.with-required-reasons.empty/no-documented-reason-for-latest-update",
      );
    }
    isEqual(
      (payload ?? svernik)[NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE],
      NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_DEFAULT,
      `Expected the mark of the absence of a reason for latest update in its default state, got ${JSON.stringify((payload ?? svernik)[NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE])}.`,
    );
    return svernik;
  },
);

But("I provide incorrect note: {}", (data: TestData, note: string): TestData =>
  provideField(data, NOTE, note));
