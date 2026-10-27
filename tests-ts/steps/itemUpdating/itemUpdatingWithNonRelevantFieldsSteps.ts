// Ported from
// features/item_updating/item_updating_with_non_relevant_fields_steps.clj
// — complete.
import { And, Then, type TestData } from "../../support/world.ts";
import { ITEM_KEYWORDS_ORDER } from "../../../src-ts/domain/svernik.ts";
import { generateNonUserProvidedFields } from "../../utilities/generateNonUserProvidedFields.ts";
import { isNotReflectsNonUserFields } from "../../utilities/isNotReflectsNonUserFields.ts";
import { ITEM_USER_PROVIDED_KEYWORDS } from "../../utilities/validators.ts";

And("I provide values for non-user-provided item fields", (itemUpdateData: TestData): TestData =>
  generateNonUserProvidedFields(
    ITEM_KEYWORDS_ORDER,
    ITEM_USER_PROVIDED_KEYWORDS,
    itemUpdateData as Record<string, unknown>,
  ));

Then("Item doesn't reflect non-user-provided fields values", (itemRequestResults: TestData): TestData => {
  isNotReflectsNonUserFields(
    itemRequestResults.updateData as Record<string, unknown>,
    itemRequestResults.updatedItem as Record<string, unknown>,
  );
  return itemRequestResults;
});
