// Ported from features/svernik_updating/
// svernik_updating_required_fields_steps.clj — complete.
import { And, But, Then, equalsValue, is, isEqual, type TestData } from "../../support/world.ts";
import {
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE,
  REASON_FOR_LATEST_UPDATE,
  REASON_FOR_LATEST_UPDATE_DEFAULT,
} from "../../../src-ts/domain/svernik.ts";
import {
  ABSENT,
  assocInConvertedToJson,
  assocInIfNotAbsent,
  assocInParsedFromJsonIfNotAbsent,
  assocInPath,
  fieldifyEssence,
} from "../../utilities/handleRawData.ts";
import { attemptToUpdateListReturnStatusAndErrors } from "../../utilities/requestList.ts";

// svernik_raw_data_description: POSSIBLE_BASIC_JSON_INPUTS /
// POSSIBLE_CONDITIONALLY_OPTIONAL_STRING_INPUTS (:absent is the
// handle-raw-data sentinel — an input that keeps the field untouched).
const NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_POSSIBLE_JSON_INPUTS = [
  ABSENT,
  null,
  false,
  true,
  "",
  "non-empty string",
  123,
  {},
  [],
] as const;

const REASON_FOR_LATEST_UPDATE_POSSIBLE_VALID_JSON_INPUTS = [
  ABSENT,
  null,
  "",
  "non-empty string",
] as const;

And(
  "I provide the following mark of the absence of a reason for latest update: {}",
  (svernikUpdateData: TestData, noDocumentedReasonForLatestUpdate: string): TestData =>
    assocInParsedFromJsonIfNotAbsent(
      svernikUpdateData,
      ["svernikData", NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE],
      noDocumentedReasonForLatestUpdate,
    ),
);

But("I provide incorrect reason for latest update: {}", (essenceUpdateData: TestData, reasonForLatestUpdate: string): TestData =>
  assocInConvertedToJson(essenceUpdateData, ["svernikData", REASON_FOR_LATEST_UPDATE], reasonForLatestUpdate));

And(
  "I provide any mark of the absence of a reason for latest update",
  (svernikUpdateData: TestData): TestData => ({
    svernikUpdatesData: NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_POSSIBLE_JSON_INPUTS.map(
      (input) =>
        assocInIfNotAbsent(
          svernikUpdateData,
          ["svernikData", NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE],
          input,
        ),
    ),
    auth: svernikUpdateData.auth,
  }),
);

Then("my several attempts to update a svernik fail", async (data: TestData): Promise<TestData> => {
  const token = (data.auth as { sessionToken?: string } | undefined)?.sessionToken;
  const attempts = [];
  for (const updateData of data.svernikUpdatesData as { id: string; svernikData: unknown }[]) {
    attempts.push(
      await attemptToUpdateListReturnStatusAndErrors(token, updateData.id, updateData.svernikData),
    );
  }
  const statuses = new Set(attempts.map((attempt) => attempt.status));
  // Clojure (into #{} ...) dedupes failed attempts by value; JSON keys
  // of the parsed envelopes key a Set the same way.
  const failedActionsAttempts = [
    ...new Set(attempts.map((attempt) => JSON.stringify(attempt.failedActionsAttempt))),
  ].map((raw) => JSON.parse(raw));
  is(
    equalsValue(statuses.size, 1),
    `Expected a single status across the svernik update attempts, got: ${JSON.stringify([...statuses])}.`,
  );
  is(
    equalsValue(failedActionsAttempts.length, 1),
    `Expected a single failed-action attempt across the svernik update attempts, got: ${JSON.stringify(failedActionsAttempts)}.`,
  );
  return { status: attempts[0]!.status, failedActionsAttempt: failedActionsAttempts[0] };
});

But(
  "I provide the following incorrect mark of the absence of a reason for latest update: {}",
  (svernikUpdateData: TestData, noDocumentedReasonForLatestUpdate: string): TestData =>
    assocInConvertedToJson(
      svernikUpdateData,
      ["svernikData", NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE],
      noDocumentedReasonForLatestUpdate,
    ),
);

And(
  "I provide any valid reason for latest update",
  (svernikUpdateData: TestData): TestData => ({
    svernikUpdatesData: REASON_FOR_LATEST_UPDATE_POSSIBLE_VALID_JSON_INPUTS.map((input) =>
      assocInIfNotAbsent(svernikUpdateData, ["svernikData", REASON_FOR_LATEST_UPDATE], input),
    ),
    auth: svernikUpdateData.auth,
  }),
);

And("I provide the following absent or empty reason for latest update: {}", (essenceUpdateData: TestData, reasonForLatestUpdate: string): TestData =>
  assocInParsedFromJsonIfNotAbsent(essenceUpdateData, ["svernikData", REASON_FOR_LATEST_UPDATE], reasonForLatestUpdate));

But(
  "I provide the following absent or empty mark of the absence of a reason for latest update: {}",
  (svernikUpdateData: TestData, noDocumentedReasonForLatestUpdate: string): TestData =>
    assocInParsedFromJsonIfNotAbsent(
      svernikUpdateData,
      ["svernikData", NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE],
      noDocumentedReasonForLatestUpdate,
    ),
);

Then(
  "I need to explicitly state the absence of a reason for latest update",
  (svernikUpdateData: TestData): TestData =>
    assocInPath(svernikUpdateData, ["svernikData", NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE], true),
);

Then("Updated svernik contains reason for latest update in its default state", (svernikUpdateResults: TestData): TestData => {
  const reason = (svernikUpdateResults.preparedList as Record<string, unknown>)[
    REASON_FOR_LATEST_UPDATE
  ];
  isEqual(
    reason,
    REASON_FOR_LATEST_UPDATE_DEFAULT,
    `Expected the reason for latest update in its default state (${JSON.stringify(REASON_FOR_LATEST_UPDATE_DEFAULT)}), got ${JSON.stringify(reason)}.`,
  );
  return svernikUpdateResults;
});

Then("Updated svernik contains mark of the absence of a reason for latest update", (svernikUpdateResults: TestData): TestData => {
  const mark = (svernikUpdateResults.preparedList as Record<string, unknown>)[
    NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE
  ];
  is(
    mark === true,
    `Expected the mark of the absence of a reason for latest update to be true, got ${JSON.stringify(mark)}.`,
  );
  return svernikUpdateResults;
});

And("I want to do svernik update again", (data: TestData): TestData => {
  const preparedList = data.preparedList as Record<string, unknown>;
  return {
    id: preparedList.id,
    svernikData: {},
    essence: fieldifyEssence(preparedList),
    auth: data.auth,
  };
});
