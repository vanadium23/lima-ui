// Ported from features/svernik_creating/
// svernik_creating_with_items_only_with_required_fields_steps.clj
// — complete (the item-investigation steps were shared with the item
// domain scenarios earlier; this slice adds the remaining provisioning
// steps).
import {
  And,
  But,
  Then,
  equalsValue,
  is,
  isEqual,
  type TestData,
} from "../../support/world.ts";
import {
  CONTENT,
  NEWER_VERSION_ID_DEFAULT,
  NOTE_DEFAULT,
  OLDER_VERSION_ID_DEFAULT,
  PURPOSE_DEFAULT,
  REASON_FOR_LATEST_UPDATE_DEFAULT,
} from "../../../src-ts/domain/svernik.ts";
import {
  areValidItems,
  addToItemsForUpdateOrCreation,
} from "../../utilities/handleItems.ts";
import { createRandomString } from "../../utilities/buildRandom.ts";
import { assocParsedFromJsonIfNotAbsent } from "../../utilities/handleRawData.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import { isThatAllFieldsInEssenceOverviewed } from "../../utilities/isThatAllFieldsInEssenceOverviewed.ts";
import {
  getPayloadAccounted,
  type PayloadAccounted,
} from "../../utilities/payloadAccounted.ts";
import {
  ESSENCE_FIELD_SPECIFICATIONS,
  isItem,
} from "../../utilities/validators.ts";
import {
  PROVIDED_CONTENT,
  PROVIDED_CONTENTS,
} from "../../utilities/sharedConstants.ts";

const itemOf = (data: TestData): PayloadAccounted => data.item as PayloadAccounted;

// (.register! payload-accounted field): registers the visited field and
// returns the field getter.
const registerField = (
  payloadAccounted: PayloadAccounted,
  field: string,
): ((item: unknown) => unknown) => {
  payloadAccounted.fieldsChecked.add(field);
  return (item: unknown) => (item as Record<string, unknown>)[field];
};

const validBySpecification = (specificationName: string): ((value: unknown) => boolean) => {
  const specification = ESSENCE_FIELD_SPECIFICATIONS[specificationName];
  if (specification === undefined) {
    throw new Error(`Unknown essence field specification: ${specificationName}`);
  }
  return specification;
};

const accountedOf = (data: TestData): PayloadAccounted =>
  // (or (:prepared-list svernik-accounted) svernik-accounted): an
  // already-accounted payload is reused, never re-wrapped.
  (data.preparedList ?? data) as unknown as PayloadAccounted;

// (or (:payload item) (:updated-item item) item) — the donor read for
// the default-state checks.
const payloadOrUpdatedItemOrSelf = (item: PayloadAccounted): Record<string, unknown> =>
  (item.payload ??
    (item as { updatedItem?: Record<string, unknown> }).updatedItem ??
    item) as Record<string, unknown>;

And("I provide an item with correct content", (svernikData: TestData): TestData => ({
  ...addToItemsForUpdateOrCreation(svernikData as Record<string, unknown>, {
    content: PROVIDED_CONTENT,
  }),
  auth: svernikData.auth,
}));

And("I provide several items with correct content", (svernikData: TestData): TestData => ({
  ...addToItemsForUpdateOrCreation(
    svernikData as Record<string, unknown>,
    PROVIDED_CONTENTS.map((content) => ({ content })),
  ),
  auth: svernikData.auth,
}));

Then("Created list contains one item", (data: TestData): TestData => {
  const preparedList = (data.preparedList ?? data) as Record<string, unknown>;
  const items = (preparedList.items ?? []) as Record<string, unknown>[];
  is(
    equalsValue(items.length, 1),
    `Expected exactly one item in the created list, got ${JSON.stringify(preparedList.items)}.`,
  );
  const item = items[0];
  isItem(item);
  return { ...data, item };
});

And("I want to do the precise investigation of the item", (data: TestData): TestData => ({
  ...data,
  item: getPayloadAccounted((data.item ?? null) as Record<string, unknown>),
}));

And("I provide one item with length: {int}", (listData: TestData, itemContentLength: number): TestData => ({
  ...addToItemsForUpdateOrCreation(listData as Record<string, unknown>, {
    [CONTENT]: createRandomString(itemContentLength),
  }),
  auth: listData.auth,
}));

// (range items-count) starts at 0: item-0, item-1, ...
And("I provide items with total number of: {int}", (listData: TestData, itemsCount: number): TestData => ({
  ...addToItemsForUpdateOrCreation(
    listData as Record<string, unknown>,
    Array.from({ length: itemsCount }, (_, index) => ({ [CONTENT]: `item-${index}` })),
  ),
  auth: listData.auth,
}));

And("I want to do the precise investigation of the items", (svernik: TestData): PayloadAccounted =>
  getPayloadAccounted((svernik.preparedList ?? svernik) as Record<string, unknown>));

But("I provide an item with the absent, empty or incorrect content: {}", (svernikData: TestData, content: string): TestData => ({
  ...addToItemsForUpdateOrCreation(
    svernikData as Record<string, unknown>,
    assocParsedFromJsonIfNotAbsent({}, CONTENT, content),
  ),
  auth: svernikData.auth,
}));

Then("item contains the id", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(itemOf(data), ["id"], "svernik.domain.item/id");
  return data;
});

Then("item contains the original list", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    itemOf(data),
    ["originalList"],
    "svernik.domain.link-to-list/link-to-list",
  );
  isEssenceAccountedFieldValid(
    itemOf(data),
    ["originalListId"],
    "svernik.domain.item/original-list-id",
  );
  return data;
});

Then("item contains the exported data", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    itemOf(data),
    ["exportedTo"],
    "svernik.domain.with-exported-to/exported-to",
  );
  return data;
});

Then("item contains user id", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(itemOf(data), ["userId"], "svernik.domain.with-user-id/user-id");
  return data;
});

Then("item contains the version id", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(itemOf(data), ["versionId"], "svernik.domain.item/version-id");
  return data;
});

const assertItemDefaultAccountedField = (
  data: TestData,
  pathToField: string[],
  specificationName: string,
  defaultValue: unknown,
  description: string,
): void => {
  const item = itemOf(data);
  isEssenceAccountedFieldValid(item, pathToField, specificationName);
  const value = item.getField(pathToField);
  isEqual(
    value,
    defaultValue,
    `Expected the ${description} to be the default (${JSON.stringify(defaultValue)}), got ${JSON.stringify(value)}.`,
  );
};

Then("item contains the older version id in its default state", (data: TestData): TestData => {
  assertItemDefaultAccountedField(
    data,
    ["olderVersionId"],
    "svernik.domain.item/older-version-id",
    OLDER_VERSION_ID_DEFAULT,
    "older version id of the item",
  );
  return data;
});

Then("item contains the newer version id in its default state", (data: TestData): TestData => {
  assertItemDefaultAccountedField(
    data,
    ["newerVersionId"],
    "svernik.domain.item/newer-version-id",
    NEWER_VERSION_ID_DEFAULT,
    "newer version id of the item",
  );
  return data;
});

Then("item contains the URL", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(itemOf(data), ["URL"], "svernik.domain.with-URL/URL");
  return data;
});

Then("item contains the type", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(itemOf(data), ["type"], "svernik.domain.item/type");
  return data;
});

Then("item contains the date and time of creation", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    itemOf(data),
    ["createdAt"],
    "svernik.domain.with-created-at/created-at",
  );
  return data;
});

Then("item contains the provided content", (data: TestData): TestData => {
  const item = itemOf(data);
  isEssenceAccountedFieldValid(item, ["content"], "svernik.domain.item/content");
  isEqual(
    item.payload.content,
    PROVIDED_CONTENT,
    `Expected the item content to be ${JSON.stringify(PROVIDED_CONTENT)}, got ${JSON.stringify(item.payload.content)}.`,
  );
  return data;
});

// (when (:payload item) ...) — the accounted-read guards only run for a
// payload-accounted item; the default itself is read from the payload,
// the updated item or the item itself.
const assertItemDefaultStateField = (
  data: TestData,
  pathToField: string[],
  specificationName: string,
  field: string,
  defaultValue: unknown,
  description: string,
): void => {
  const item = itemOf(data);
  if (item.payload != null) {
    isEssenceAccountedFieldValid(item, pathToField, specificationName);
  }
  const value = payloadOrUpdatedItemOrSelf(item)[field];
  isEqual(
    value,
    defaultValue,
    `Expected the ${description} to be the default (${JSON.stringify(defaultValue)}), got ${JSON.stringify(value)}.`,
  );
};

Then("item contains purpose in its default state", (data: TestData): TestData => {
  assertItemDefaultStateField(
    data,
    ["purpose"],
    "svernik.domain.item/purpose",
    "purpose",
    PURPOSE_DEFAULT,
    "item purpose",
  );
  return data;
});

Then("item contains reason for latest update in its default state", (data: TestData): TestData => {
  assertItemDefaultStateField(
    data,
    ["reasonForLatestUpdate"],
    "svernik.domain.item/reason-for-latest-update",
    "reasonForLatestUpdate",
    REASON_FOR_LATEST_UPDATE_DEFAULT,
    "item reason for latest update",
  );
  return data;
});

Then("item contains note in its default state", (data: TestData): TestData => {
  assertItemDefaultStateField(
    data,
    ["note"],
    "svernik.domain.with-note/note",
    "note",
    NOTE_DEFAULT,
    "item note",
  );
  return data;
});

Then("Items contain the id", (svernik: TestData): PayloadAccounted => {
  // The donor's first Items step wraps the raw svernik data once.
  const svernikAccounted = getPayloadAccounted((svernik.preparedList ?? svernik) as Record<
    string,
    unknown
  >);
  const id = registerField(svernikAccounted, "id");
  areValidItems(svernikAccounted, (item) =>
    validBySpecification("svernik.domain.item/id")(id(item)));
  return svernikAccounted;
});

Then("Items contain the original list", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const linkToList = validBySpecification("svernik.domain.link-to-list/link-to-list");
  const originalListId = validBySpecification("svernik.domain.item/original-list-id");
  areValidItems(accounted, (item) => {
    const record = item as Record<string, unknown>;
    return linkToList(record.originalList) && originalListId(record.originalListId);
  });
  for (const _item of ((accounted.payload ?? {}) as Record<string, unknown>).items as
    | unknown[]
    | undefined ?? []) {
    accounted.fieldsChecked.add("originalList");
    accounted.fieldsChecked.add("originalListId");
  }
  return accounted;
});

Then("Items contain the exported data", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const exportedTo = registerField(accounted, "exportedTo");
  areValidItems(accounted, (item) =>
    validBySpecification("svernik.domain.with-exported-to/exported-to")(exportedTo(item)));
  return accounted;
});

Then("Items contain the user id", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const userId = registerField(accounted, "userId");
  areValidItems(accounted, (item) =>
    validBySpecification("svernik.domain.with-user-id/user-id")(userId(item)));
  return accounted;
});

Then("Items contain the version id", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const versionId = registerField(accounted, "versionId");
  areValidItems(accounted, (item) =>
    validBySpecification("svernik.domain.item/version-id")(versionId(item)));
  return accounted;
});

Then("Items contain the older version id in its default state", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const olderVersionId = registerField(accounted, "olderVersionId");
  const olderVersionIdSpecification = validBySpecification(
    "svernik.domain.item/older-version-id",
  );
  areValidItems(accounted, (item) => olderVersionIdSpecification(olderVersionId(item)));
  areValidItems(accounted, (item) => equalsValue(olderVersionId(item), OLDER_VERSION_ID_DEFAULT));
  return accounted;
});

Then("Items contain the newer version id in its default state", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const newerVersionId = registerField(accounted, "newerVersionId");
  const newerVersionIdSpecification = validBySpecification(
    "svernik.domain.item/newer-version-id",
  );
  areValidItems(accounted, (item) => newerVersionIdSpecification(newerVersionId(item)));
  areValidItems(accounted, (item) => equalsValue(newerVersionId(item), NEWER_VERSION_ID_DEFAULT));
  return accounted;
});

Then("Items contain the URL", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const URL = registerField(accounted, "URL");
  areValidItems(accounted, (item) =>
    validBySpecification("svernik.domain.with-URL/URL")(URL(item)));
  return accounted;
});

Then("Items contain the type", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const type = registerField(accounted, "type");
  areValidItems(accounted, (item) =>
    validBySpecification("svernik.domain.item/type")(type(item)));
  return accounted;
});

Then("Items contain the date and time of creation", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const createdAt = registerField(accounted, "createdAt");
  areValidItems(accounted, (item) =>
    validBySpecification("svernik.domain.with-created-at/created-at")(createdAt(item)));
  return accounted;
});

Then("Items contain the provided content", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const content = registerField(accounted, "content");
  const items = (((accounted.payload ?? {}) as Record<string, unknown>).items ?? []) as Record<
    string,
    unknown
  >[];
  isEqual(
    items.map((item) => content(item)).slice(-PROVIDED_CONTENTS.length),
    [...PROVIDED_CONTENTS],
    `Expected the last items' contents to equal the provided contents, got ${JSON.stringify(items)}.`,
  );
  return accounted;
});

Then("Items contain purpose in its default state", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const purpose = registerField(accounted, "purpose");
  areValidItems(accounted, (item) => equalsValue(purpose(item), PURPOSE_DEFAULT));
  return accounted;
});

Then("Items contain reason for latest update in its default state", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const reasonForLatestUpdate = registerField(accounted, "reasonForLatestUpdate");
  areValidItems(accounted, (item) =>
    equalsValue(reasonForLatestUpdate(item), REASON_FOR_LATEST_UPDATE_DEFAULT));
  return accounted;
});

Then("Items contain note in its default state", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  const note = registerField(accounted, "note");
  areValidItems(accounted, (item) => equalsValue(note(item), NOTE_DEFAULT));
  return accounted;
});

Then("I overviewed all fields in items", (svernikAccounted: TestData): PayloadAccounted => {
  const accounted = accountedOf(svernikAccounted);
  isThatAllFieldsInEssenceOverviewed(accounted, "svernik.domain.item/item-keys");
  return accounted;
});
