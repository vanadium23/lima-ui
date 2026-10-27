// Ported from features/svernik_updating/
// svernik_updating_with_referenced_items_and_updates_steps.clj — complete.
import { And, But, Then, equalsValue, is, isEqual, type TestData } from "../../support/world.ts";
import {
  CONTENT,
  ID,
  NOTE,
  OLDER_VERSION_ID_DEFAULT,
  PURPOSE,
  REASON_FOR_LATEST_UPDATE,
} from "../../../src-ts/domain/svernik.ts";
import { assocInLastItemWith, type AssocInMethod } from "../../utilities/handleItems.ts";
import { assocInPath } from "../../utilities/handleRawData.ts";
import { createRandomString } from "../../utilities/buildRandom.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import type { PayloadAccounted } from "../../utilities/payloadAccounted.ts";
import {
  PROVIDED_CONTENT_UPDATE,
  PROVIDED_CORRECT_ITEMS,
  PROVIDED_NOTE_UPDATE,
  PROVIDED_PURPOSE_UPDATE,
  PROVIDED_REASON_FOR_LATEST_UPDATE,
} from "../../utilities/sharedConstants.ts";

const NOTE_TO_BE_CLEARED = "note-to-be-cleared";

// The last item of the provided correct items (donor ((last
// PROVIDED_CORRECT_ITEMS) "content")).
const LAST_PROVIDED_CONTENT = PROVIDED_CORRECT_ITEMS[PROVIDED_CORRECT_ITEMS.length - 1]!
  .content;

// Every provisioning step is assoc-in-last-item with plain assoc-in;
// parse-from-JSON is a plain JSON parse (json/read-str).
const updateLastItem = (
  listData: TestData,
  field: string,
  value: unknown,
): TestData =>
  assocInLastItemWith(
    listData as Record<string, unknown>,
    assocInPath as AssocInMethod,
    field,
    value,
  ) as TestData;

const updateLastItemFromJson = (
  listData: TestData,
  field: string,
  cell: string,
): TestData => updateLastItem(listData, field, JSON.parse(cell));

And("I update last item with other content", (listData: TestData): TestData =>
  updateLastItem(listData, CONTENT, PROVIDED_CONTENT_UPDATE));

Then("item contains the other content", (data: TestData): TestData => {
  const item = data.item as PayloadAccounted;
  isEssenceAccountedFieldValid(item, [CONTENT], "svernik.domain.item/content");
  isEqual(
    (item.payload as Record<string, unknown>)[CONTENT],
    PROVIDED_CONTENT_UPDATE,
    `Expected the other content, got ${JSON.stringify((item.payload as Record<string, unknown>)[CONTENT])}.`,
  );
  return data;
});

And("I update last item with other purpose", (listData: TestData): TestData =>
  updateLastItem(listData, PURPOSE, PROVIDED_PURPOSE_UPDATE));

Then("item contains the other purpose", (data: TestData): TestData => {
  const item = data.item as PayloadAccounted;
  isEssenceAccountedFieldValid(item, [PURPOSE], "svernik.domain.item/purpose");
  isEqual(
    (item.payload as Record<string, unknown>)[PURPOSE],
    PROVIDED_PURPOSE_UPDATE,
    `Expected the other purpose, got ${JSON.stringify((item.payload as Record<string, unknown>)[PURPOSE])}.`,
  );
  return data;
});

And("I update last item with other note", (listData: TestData): TestData =>
  updateLastItem(listData, NOTE, PROVIDED_NOTE_UPDATE));

Then("item contains the other note", (data: TestData): TestData => {
  const item = data.item as PayloadAccounted;
  isEssenceAccountedFieldValid(item, [NOTE], "svernik.domain.with-note/note");
  isEqual(
    (item.payload as Record<string, unknown>)[NOTE],
    PROVIDED_NOTE_UPDATE,
    `Expected the other note, got ${JSON.stringify((item.payload as Record<string, unknown>)[NOTE])}.`,
  );
  return data;
});

And("I update last item with other reason for latest update", (listData: TestData): TestData =>
  updateLastItem(listData, REASON_FOR_LATEST_UPDATE, PROVIDED_REASON_FOR_LATEST_UPDATE));

Then("item contains other reason for latest update", (data: TestData): TestData => {
  const item = data.item as PayloadAccounted;
  isEssenceAccountedFieldValid(
    item,
    [REASON_FOR_LATEST_UPDATE],
    "svernik.domain.item/reason-for-latest-update",
  );
  isEqual(
    (item.payload as Record<string, unknown>)[REASON_FOR_LATEST_UPDATE],
    PROVIDED_REASON_FOR_LATEST_UPDATE,
    `Expected the other reason for latest update, got ${JSON.stringify((item.payload as Record<string, unknown>)[REASON_FOR_LATEST_UPDATE])}.`,
  );
  return data;
});

And("I update last item with same content", (listData: TestData): TestData =>
  updateLastItem(listData, CONTENT, LAST_PROVIDED_CONTENT));

Then("item contains the same content", (data: TestData): TestData => {
  const item = data.item as PayloadAccounted;
  isEssenceAccountedFieldValid(item, [CONTENT], "svernik.domain.item/content");
  isEqual(
    (item.payload as Record<string, unknown>)[CONTENT],
    LAST_PROVIDED_CONTENT,
    `Expected the same content, got ${JSON.stringify((item.payload as Record<string, unknown>)[CONTENT])}.`,
  );
  return data;
});

Then("item contains the older version id in non-default state", (data: TestData): TestData => {
  const item = data.item as PayloadAccounted;
  isEssenceAccountedFieldValid(
    item,
    ["olderVersionId"],
    "svernik.domain.item/older-version-id",
  );
  const olderVersionId = item.getField(["olderVersionId"]);
  is(
    !equalsValue(olderVersionId, OLDER_VERSION_ID_DEFAULT),
    `Expected the older version id in a non-default state, got ${JSON.stringify(olderVersionId)}.`,
  );
  return data;
});

But(
  "I provide an empty or incorrect link to the last item: {}",
  (listData: TestData, itemLink: string): TestData =>
    updateLastItemFromJson(listData, ID, itemLink),
);

But(
  "I provide a corrupted content to the last item: {}",
  (listData: TestData, content: string): TestData =>
    updateLastItemFromJson(listData, CONTENT, content),
);

But(
  "I provide a corrupted purpose to the last item: {}",
  (listData: TestData, purpose: string): TestData =>
    updateLastItemFromJson(listData, PURPOSE, purpose),
);

But(
  "I provide a corrupted note to the last item: {}",
  (listData: TestData, note: string): TestData => updateLastItemFromJson(listData, NOTE, note),
);

And(
  "I update last item content with length: {int}",
  (listData: TestData, itemContentLength: number): TestData =>
    updateLastItem(listData, CONTENT, createRandomString(itemContentLength)),
);

And(
  "I provide an empty purpose to the last item: {}",
  (listData: TestData, purpose: string): TestData =>
    updateLastItemFromJson(listData, PURPOSE, purpose),
);

And(
  "I provide an empty note to the last item: {}",
  (listData: TestData, note: string): TestData => updateLastItemFromJson(listData, NOTE, note),
);

And(
  "I provide an empty reason for latest update to the last item: {}",
  (listData: TestData, reasonForLatestUpdate: string): TestData =>
    updateLastItemFromJson(listData, REASON_FOR_LATEST_UPDATE, reasonForLatestUpdate),
);

But(
  "I provide incorrect reason for latest update to the last item: {}",
  (listData: TestData, reasonForLatestUpdate: string): TestData =>
    updateLastItemFromJson(listData, REASON_FOR_LATEST_UPDATE, reasonForLatestUpdate),
);

And("last item gets a note", (listData: TestData): TestData =>
  updateLastItem(listData, NOTE, NOTE_TO_BE_CLEARED));

Then("item contains the previous note", (data: TestData): TestData => {
  const item = data.item as PayloadAccounted;
  isEssenceAccountedFieldValid(item, [NOTE], "svernik.domain.with-note/note");
  isEqual(
    (item.payload as Record<string, unknown>)[NOTE],
    NOTE_TO_BE_CLEARED,
    `Expected the previous note, got ${JSON.stringify((item.payload as Record<string, unknown>)[NOTE])}.`,
  );
  return data;
});
