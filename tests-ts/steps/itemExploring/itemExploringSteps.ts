// Ported from features/item_exploring/item_exploring_steps.clj
// — complete.
import { Then, When, isEqual, type TestData } from "../../support/world.ts";
import {
  NEWER_VERSION_ID_DEFAULT,
  NOTE_DEFAULT,
  OLDER_VERSION_ID_DEFAULT,
  PURPOSE_DEFAULT,
  REASON_FOR_LATEST_UPDATE_DEFAULT,
} from "../../../src-ts/domain/svernik.ts";
import type { ApiResponse } from "../../support/http.ts";
import { isItem } from "../../utilities/validators.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import { isEssenceIdInErrorMessage } from "../../utilities/isEssenceIdInErrorMessage.ts";
import { isEssenceNotFoundReturnFailedActionsAttempt } from "../../utilities/isEssenceNotFound.ts";
import { isThatAllFieldsInEssenceOverviewed } from "../../utilities/isThatAllFieldsInEssenceOverviewed.ts";
import {
  getPayloadAccounted,
  type PayloadAccounted,
} from "../../utilities/payloadAccounted.ts";
import {
  requestItemExploration,
  requestItemExplorationParsed,
} from "../../utilities/requestItem.ts";
import { UNAVAILABLE_ITEM_ID } from "../../utilities/sharedConstants.ts";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

const itemOf = (data: TestData): PayloadAccounted => data.item as PayloadAccounted;

const assertAccountedFieldValid = (
  data: TestData,
  pathToField: string[],
  specificationName: string,
): void => {
  isEssenceAccountedFieldValid(itemOf(data), pathToField, specificationName);
};

When("I ask to show me a specific item", async (data: TestData): Promise<TestData> => {
  const token = sessionTokenOf(data);
  const explored = async (id: string): Promise<unknown> =>
    requestItemExplorationParsed(token, id);
  return {
    ...data,
    item: getPayloadAccounted({
      ordinary: await explored("item-ordinary"),
      itemWithoutNote: await explored("item-without-note"),
      itemWithNoPurpose: await explored("item-with-no-purpose"),
      itemWithNoDocumentedReasonForLatestUpdate: await explored(
        "item-with-no-documented-reason-for-latest-update",
      ),
    }),
  };
});

Then("It's item", (data: TestData): TestData => {
  for (const someItem of Object.values(itemOf(data).payload)) {
    isItem(someItem);
  }
  return data;
});

Then("I see item's id", (data: TestData): TestData => {
  assertAccountedFieldValid(data, ["ordinary", "id"], "svernik.domain.item/id");
  return data;
});

Then("I see item's original list", (data: TestData): TestData => {
  assertAccountedFieldValid(
    data,
    ["ordinary", "originalList"],
    "svernik.domain.link-to-list/link-to-list",
  );
  assertAccountedFieldValid(
    data,
    ["ordinary", "originalListId"],
    "svernik.domain.item/original-list-id",
  );
  return data;
});

Then("I see item's exported data", (data: TestData): TestData => {
  assertAccountedFieldValid(
    data,
    ["ordinary", "exportedTo"],
    "svernik.domain.with-exported-to/exported-to",
  );
  return data;
});

Then("I see item's user id", (data: TestData): TestData => {
  assertAccountedFieldValid(data, ["ordinary", "userId"], "svernik.domain.with-user-id/user-id");
  return data;
});

Then("I see item's version id", (data: TestData): TestData => {
  assertAccountedFieldValid(data, ["ordinary", "versionId"], "svernik.domain.item/version-id");
  return data;
});

const assertDefaultAccountedField = (
  data: TestData,
  pathToField: string[],
  specificationName: string,
  defaultValue: unknown,
  description: string,
): void => {
  const payloadAccounted = itemOf(data);
  isEssenceAccountedFieldValid(payloadAccounted, pathToField, specificationName);
  const value = payloadAccounted.getField(pathToField);
  isEqual(
    value,
    defaultValue,
    `Expected the ${description} to be the default (${JSON.stringify(defaultValue)}), got ${JSON.stringify(value)}.`,
  );
};

Then("I see item's older version id in its default state", (data: TestData): TestData => {
  assertDefaultAccountedField(
    data,
    ["ordinary", "olderVersionId"],
    "svernik.domain.item/older-version-id",
    OLDER_VERSION_ID_DEFAULT,
    "older version id of the item",
  );
  return data;
});

Then("I see item's newer version id in its default state", (data: TestData): TestData => {
  assertDefaultAccountedField(
    data,
    ["ordinary", "newerVersionId"],
    "svernik.domain.item/newer-version-id",
    NEWER_VERSION_ID_DEFAULT,
    "newer version id of the item",
  );
  return data;
});

Then("I see item's URL", (data: TestData): TestData => {
  assertAccountedFieldValid(data, ["ordinary", "URL"], "svernik.domain.with-URL/URL");
  return data;
});

Then("I see item's type", (data: TestData): TestData => {
  assertAccountedFieldValid(data, ["ordinary", "type"], "svernik.domain.item/type");
  return data;
});

Then("I see item's date and time of creation", (data: TestData): TestData => {
  assertAccountedFieldValid(
    data,
    ["ordinary", "createdAt"],
    "svernik.domain.with-created-at/created-at",
  );
  return data;
});

Then("I see its content", (data: TestData): TestData => {
  assertAccountedFieldValid(data, ["ordinary", "content"], "svernik.domain.item/content");
  return data;
});

Then("I see present or empty item's note", (data: TestData): TestData => {
  assertAccountedFieldValid(data, ["ordinary", "note"], "svernik.domain.with-note/note");
  const payloadAccounted = itemOf(data);
  isEqual(
    payloadAccounted.getField(["itemWithoutNote", "note"]),
    NOTE_DEFAULT,
    `Expected the note of the item without a note to be the default (${JSON.stringify(NOTE_DEFAULT)}), got ${JSON.stringify(payloadAccounted.getField(["itemWithoutNote", "note"]))}.`,
  );
  return data;
});

Then("I see present or empty item's purpose", (data: TestData): TestData => {
  assertAccountedFieldValid(data, ["ordinary", "purpose"], "svernik.domain.item/purpose");
  const payloadAccounted = itemOf(data);
  isEqual(
    payloadAccounted.getField(["itemWithNoPurpose", "purpose"]),
    PURPOSE_DEFAULT,
    `Expected the purpose of the item with no purpose to be the default (${JSON.stringify(PURPOSE_DEFAULT)}), got ${JSON.stringify(payloadAccounted.getField(["itemWithNoPurpose", "purpose"]))}.`,
  );
  return data;
});

Then("I see present or empty item's reason for latest update", (data: TestData): TestData => {
  assertAccountedFieldValid(
    data,
    ["ordinary", "reasonForLatestUpdate"],
    "svernik.domain.item/reason-for-latest-update",
  );
  const payloadAccounted = itemOf(data);
  isEqual(
    payloadAccounted.getField([
      "itemWithNoDocumentedReasonForLatestUpdate",
      "reasonForLatestUpdate",
    ]),
    REASON_FOR_LATEST_UPDATE_DEFAULT,
    `Expected the reason for latest update of the item with no documented one to be the default (${JSON.stringify(REASON_FOR_LATEST_UPDATE_DEFAULT)}), got ${JSON.stringify(payloadAccounted.getField(["itemWithNoDocumentedReasonForLatestUpdate", "reasonForLatestUpdate"]))}.`,
  );
  return data;
});

Then("I overviewed all fields in item", (data: TestData): TestData => {
  isThatAllFieldsInEssenceOverviewed(itemOf(data), "svernik.domain.item/item-keys");
  return data;
});

Then("I ask to show me item by the id", (data: TestData): TestData => {
  const source = (data.preparedList ?? data) as Record<string, unknown>;
  const withPayload = (source.payload ?? source) as Record<string, unknown>;
  const items = (withPayload.items ?? []) as Record<string, unknown>[];
  return { ...withPayload, item: items[0] };
});

Then("I ask to show me all items by their ids", (data: TestData): TestData => {
  const source = (data.preparedList ?? data) as Record<string, unknown>;
  const withPayload = (source.payload ?? source) as Record<string, unknown>;
  return { items: withPayload.items };
});

When("I ask to show me the unavailable item", (data: TestData): Promise<ApiResponse> =>
  requestItemExploration(sessionTokenOf(data), UNAVAILABLE_ITEM_ID));

Then("my attempt to explore an item fails", (data: TestData): { failedActionsAttempt: unknown[] } =>
  isEssenceNotFoundReturnFailedActionsAttempt(data as unknown as ApiResponse));

Then("I see the unavailable item's id in the error message", (data: TestData): TestData => {
  isEssenceIdInErrorMessage(
    data as unknown as { failedActionsAttempt: unknown[] },
    UNAVAILABLE_ITEM_ID,
  );
  return data;
});
