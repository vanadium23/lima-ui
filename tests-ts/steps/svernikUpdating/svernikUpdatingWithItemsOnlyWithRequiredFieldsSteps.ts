// Ported from features/svernik_updating/
// svernik_updating_with_items_only_with_required_fields_steps.clj
// — complete.
import { Then, type TestData } from "../../support/world.ts";
import { PURPOSE, REASON_FOR_LATEST_UPDATE } from "../../../src-ts/domain/svernik.ts";
import { areValidItems } from "../../utilities/handleItems.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import { type PayloadAccounted } from "../../utilities/payloadAccounted.ts";
import { ESSENCE_FIELD_SPECIFICATIONS, isItem } from "../../utilities/validators.ts";
import { PROVIDED_CONTENTS } from "../../utilities/sharedConstants.ts";

// (.register! payload-accounted field): registers the visited field and
// returns the field getter.
const registerField = (
  payloadAccounted: PayloadAccounted,
  field: string,
): ((item: unknown) => unknown) => {
  payloadAccounted.fieldsChecked.add(field);
  return (item: unknown) => (item as Record<string, unknown>)[field];
};

const specification = (specificationName: string): ((value: unknown) => boolean) => {
  const fieldSpecification = ESSENCE_FIELD_SPECIFICATIONS[specificationName];
  if (fieldSpecification === undefined) {
    throw new Error(`Unknown essence field specification: ${specificationName}`);
  }
  return fieldSpecification;
};

Then("The last item is the required one", (data: TestData): TestData => {
  const someList = (data.preparedList ?? data) as Record<string, unknown>;
  const items = (someList.items ?? []) as Record<string, unknown>[];
  const item = items[items.length - 1];
  isItem(item);
  return { ...data, item };
});

Then("Several last items are the ones with the provided data", (data: TestData): TestData => {
  const preparedList = data.preparedList as Record<string, unknown>;
  const addedItems = (preparedList.items as Record<string, unknown>[]).slice(
    -PROVIDED_CONTENTS.length,
  );
  for (const item of addedItems) {
    isItem(item);
  }
  return preparedList;
});

Then("Items contain valid purpose", (svernikAccounted: TestData): TestData => {
  const accounted = svernikAccounted as unknown as PayloadAccounted;
  const purpose = registerField(accounted, PURPOSE);
  areValidItems(accounted, (item) =>
    specification("svernik.domain.item/purpose")(purpose(item)),
  );
  return svernikAccounted;
});

Then("Items contain valid reason for latest update", (svernikAccounted: TestData): TestData => {
  const accounted = svernikAccounted as unknown as PayloadAccounted;
  const reasonForLatestUpdate = registerField(accounted, REASON_FOR_LATEST_UPDATE);
  areValidItems(accounted, (item) =>
    specification("svernik.domain.item/reason-for-latest-update")(
      reasonForLatestUpdate(item),
    ),
  );
  return svernikAccounted;
});

Then("item contains valid purpose", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    data.item as PayloadAccounted,
    [PURPOSE],
    "svernik.domain.item/purpose",
  );
  return data;
});

Then("item contains valid reason for latest update", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    data.item as PayloadAccounted,
    [REASON_FOR_LATEST_UPDATE],
    "svernik.domain.item/reason-for-latest-update",
  );
  return data;
});
