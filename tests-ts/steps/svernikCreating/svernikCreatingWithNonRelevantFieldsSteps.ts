// Ported from features/svernik_creating/
// svernik_creating_with_non_relevant_fields_steps.clj — complete.
import { And, Then, is, type TestData } from "../../support/world.ts";
import { mapsNotIntersecting } from "../../utilities/mapsOperations.ts";

const NON_RELEVANT_FIELDS: Record<string, unknown> = {
  someNonRelevantField: 42,
  anotherNonRelevantField: "Yes, indeed.",
};

And("I provide several non-relevant fields", (essenceData: TestData): TestData => {
  // Clojure truthiness of (:svernik-data essence-data): nil/false mean
  // the fields merge at the top level.
  const svernikData = essenceData.svernikData;
  if (svernikData !== undefined && svernikData !== null && svernikData !== false) {
    return {
      ...essenceData,
      svernikData: {
        ...(svernikData as Record<string, unknown>),
        ...NON_RELEVANT_FIELDS,
      },
    };
  }
  return { ...essenceData, ...NON_RELEVANT_FIELDS };
});

Then("Essence doesn't reflect these non-relevant fields", (essence: TestData): TestData => {
  const updatedEssence = (essence.preparedList ??
    essence.updatedItem ??
    essence) as Record<string, unknown>;
  is(
    mapsNotIntersecting(updatedEssence, NON_RELEVANT_FIELDS),
    `Expected the essence not to reflect the non-relevant fields, got ${JSON.stringify(updatedEssence)}.`,
  );
  return essence;
});
