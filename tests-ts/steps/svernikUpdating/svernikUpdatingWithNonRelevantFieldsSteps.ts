// Ported from features/svernik_updating/
// svernik_updating_with_non_relevant_fields_steps.clj — complete.
import { And, Then, type TestData } from "../../support/world.ts";
import { SVERNIK_KEYWORDS_ORDER } from "../../../src-ts/domain/svernik.ts";
import { generateNonUserProvidedFields } from "../../utilities/generateNonUserProvidedFields.ts";
import { isNotReflectsNonUserFields } from "../../utilities/isNotReflectsNonUserFields.ts";
import { SVERNIK_USER_PROVIDED_KEYWORDS } from "../../utilities/validators.ts";

And(
  "I provide values for non-user-provided svernik fields",
  (svernikData: TestData): TestData =>
    generateNonUserProvidedFields(
      SVERNIK_KEYWORDS_ORDER,
      SVERNIK_USER_PROVIDED_KEYWORDS,
      svernikData,
    ) as TestData,
);

Then(
  "Svernik doesn't reflect non-user-provided fields values",
  (svernikRequestResults: TestData): TestData => {
    isNotReflectsNonUserFields(
      svernikRequestResults.updateData as Record<string, unknown>,
      svernikRequestResults.preparedList as Record<string, unknown>,
    );
    return svernikRequestResults;
  },
);
