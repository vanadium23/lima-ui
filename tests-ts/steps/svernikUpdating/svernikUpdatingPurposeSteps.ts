// Ported from
// features/svernik_updating/svernik_updating_purpose_steps.clj — complete.
import { And, Then, isEqual, type TestData } from "../../support/world.ts";
import { PURPOSE, PURPOSE_DEFAULT } from "../../../src-ts/domain/svernik.ts";
import { createRandomString } from "../../utilities/buildRandom.ts";
import { assocInPath } from "../../utilities/handleRawData.ts";
import { PROVIDED_PURPOSE_UPDATE } from "../../utilities/sharedConstants.ts";

And("I provide another purpose", (data: TestData): TestData =>
  assocInPath(data, ["svernikData", PURPOSE], PROVIDED_PURPOSE_UPDATE));

And("I provide another purpose with length: {int}", (data: TestData, purposeLength: number): TestData =>
  assocInPath(data, ["svernikData", PURPOSE], createRandomString(purposeLength)));

Then("Updated svernik contains the provided purpose", (data: TestData): TestData => {
  isEqual(
    (data.preparedList as Record<string, unknown>).purpose,
    PROVIDED_PURPOSE_UPDATE,
    `Expected the updated svernik purpose to be ${JSON.stringify(PROVIDED_PURPOSE_UPDATE)}, got ${JSON.stringify((data.preparedList as Record<string, unknown>).purpose)}.`,
  );
  return data;
});

Then("Updated svernik contains purpose in its default state", (data: TestData): TestData => {
  isEqual(
    (data.preparedList as Record<string, unknown>).purpose,
    PURPOSE_DEFAULT,
    `Expected the updated svernik purpose in its default state, got ${JSON.stringify((data.preparedList as Record<string, unknown>).purpose)}.`,
  );
  return data;
});
