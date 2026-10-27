// Ported from features/item_updating/item_updating_accounted_steps.clj
// — complete.
import { Then, type TestData } from "../../support/world.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import type { PayloadAccounted } from "../../utilities/payloadAccounted.ts";

const itemOf = (data: TestData): PayloadAccounted => data.item as PayloadAccounted;

Then("item contains the older version id", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    itemOf(data),
    ["olderVersionId"],
    "svernik.domain.item/older-version-id",
  );
  return data;
});

Then("item contains purpose", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(itemOf(data), ["purpose"], "svernik.domain.item/purpose");
  return data;
});

Then("item contains reason for latest update", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    itemOf(data),
    ["reasonForLatestUpdate"],
    "svernik.domain.with-required-reasons.default/reason-for-latest-update",
  );
  return data;
});

Then("item contains the user id", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(itemOf(data), ["userId"], "svernik.domain.with-user-id/user-id");
  return data;
});
