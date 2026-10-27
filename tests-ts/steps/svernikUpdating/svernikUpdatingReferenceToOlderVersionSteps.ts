// Ported from
// features/svernik_updating/svernik_updating_reference_to_older_version_steps.clj
// — complete.
import { Then, isEqual, type TestData } from "../../support/world.ts";
import { VERSION_ID } from "../../../src-ts/domain/svernik.ts";

Then("Updated svernik contains the link to its older version", (data: TestData): TestData => {
  const originalEssence = data.originalEssence as Record<string, unknown>;
  const preparedList = data.preparedList as Record<string, unknown>;
  isEqual(
    preparedList.olderVersionId,
    originalEssence[VERSION_ID],
    `Expected the older version id to be the previous version id ${JSON.stringify(originalEssence[VERSION_ID])}, got ${JSON.stringify(preparedList.olderVersionId)}.`,
  );
  return data;
});
