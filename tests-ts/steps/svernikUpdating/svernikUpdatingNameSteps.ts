// Ported from
// features/svernik_updating/svernik_updating_name_steps.clj — complete.
import { And, But, Then, When, isEqual, type TestData } from "../../support/world.ts";
import { NAME, REASON_FOR_LATEST_UPDATE } from "../../../src-ts/domain/svernik.ts";
import { createRandomString } from "../../utilities/buildRandom.ts";
import { assocInConvertedToJson, assocInPath, fieldifyEssence } from "../../utilities/handleRawData.ts";
import { requestListUpdateAndEnsureCorrectness } from "../../utilities/requestList.ts";
import {
  PROVIDED_NAME_UPDATE,
  PROVIDED_REASON_FOR_LATEST_UPDATE,
} from "../../utilities/sharedConstants.ts";

But("I provide an empty or incorrect name: {}", (data: TestData, name: string): TestData =>
  assocInConvertedToJson(data, ["svernikData", NAME], name));

When("I want to do essence update", (essence: TestData): TestData => {
  const list = (essence.item ??
    essence.preparedList ??
    essence.createdList ??
    essence) as Record<string, unknown>;
  const updateData: TestData = {
    id: list.id,
    svernikData: {},
    essence: fieldifyEssence(list),
    auth: essence.auth,
  };
  // cond-> branch: only the creation flow carries the previous version.
  if (essence.createdList != null) {
    updateData.additionalData = { previousSvernik: essence.previousSvernik };
  }
  return updateData;
});

And("I provide another name", (data: TestData): TestData =>
  assocInPath(data, ["svernikData", NAME], PROVIDED_NAME_UPDATE));

And("I provide an another name with length: {int}", (data: TestData, nameLength: number): TestData =>
  assocInPath(data, ["svernikData", NAME], createRandomString(nameLength)));

And("I provide a reason for latest update", (data: TestData): TestData =>
  assocInPath(
    data,
    ["svernikData", REASON_FOR_LATEST_UPDATE],
    PROVIDED_REASON_FOR_LATEST_UPDATE,
  ));

Then(
  "I successfully update the svernik and see properly sorted updated version of it",
  async (data: TestData): Promise<TestData> => {
    const { auth, essence, svernikData, additionalData } = data;
    const updateResults = await requestListUpdateAndEnsureCorrectness(
      (auth as { sessionToken?: string } | undefined)?.sessionToken,
      data as { id: string; svernikData: unknown },
    );
    return {
      ...data,
      ...updateResults,
      originalEssence: essence,
      updateData: svernikData,
      additionalData,
    };
  },
);

Then("Updated svernik contains the provided name", (data: TestData): TestData => {
  isEqual(
    (data.preparedList as Record<string, unknown>).name,
    PROVIDED_NAME_UPDATE,
    `Expected the updated svernik name to be ${JSON.stringify(PROVIDED_NAME_UPDATE)}, got ${JSON.stringify((data.preparedList as Record<string, unknown>).name)}.`,
  );
  return data;
});

Then("updated svernik contains the provided reason for latest update", (data: TestData): TestData => {
  isEqual(
    (data.preparedList as Record<string, unknown>).reasonForLatestUpdate,
    PROVIDED_REASON_FOR_LATEST_UPDATE,
    `Expected the updated svernik reason for latest update to be ${JSON.stringify(PROVIDED_REASON_FOR_LATEST_UPDATE)}, got ${JSON.stringify((data.preparedList as Record<string, unknown>).reasonForLatestUpdate)}.`,
  );
  return data;
});

Then("updated svernik contains mark of the presence of a reason for latest update", (data: TestData): TestData => {
  isEqual(
    (data.preparedList as Record<string, unknown>).noDocumentedReasonForLatestUpdate,
    false,
    "Expected the mark of the presence of a reason for latest update (false).",
  );
  return data;
});
