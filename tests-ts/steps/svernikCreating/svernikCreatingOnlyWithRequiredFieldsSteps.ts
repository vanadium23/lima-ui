// Ported from
// features/svernik_creating/svernik_creating_only_with_required_fields_steps.clj
// — complete.
import { And, But, Then, When, is, equalsValue, type TestData } from "../../support/world.ts";
import {
  CREATED_AT,
  ID,
  NAME,
  NEWER_VERSION_ID_DEFAULT,
  OLDER_VERSION_ID_DEFAULT,
  PURPOSE,
  PURPOSE_DEFAULT,
  TYPE,
  URL_FIELD,
  VERSION_ID,
} from "../../../src-ts/domain/svernik.ts";
import { parseBodyFromJson, type ApiResponse } from "../../support/http.ts";
import { BAD_REQUEST, CREATED } from "../../utilities/httpStatuses.ts";
import { createRandomString } from "../../utilities/buildRandom.ts";
import { doseqParallel } from "../../utilities/doseqParallel.ts";
import {
  assocConvertedToJson,
  assocInConvertedToJson,
  assocInParsedFromJsonIfNotAbsent,
  assocParsedFromJsonIfNotAbsent,
} from "../../utilities/handleRawData.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import { doseqIsFailedActionsAttempt } from "../../utilities/iterate.ts";
import type { PayloadAccounted } from "../../utilities/payloadAccounted.ts";
import {
  errorsJsonProperlySorted,
  essenceJsonProperlySorted,
} from "../../utilities/properlySortedJson.ts";
import { requestListCreation } from "../../utilities/requestList.ts";
import {
  PROVIDED_NAME_UPDATE,
  PROVIDED_PURPOSE_UPDATE,
} from "../../utilities/sharedConstants.ts";
import { isErrors, isSvernik } from "../../utilities/validators.ts";

export const PROVIDED_NAME = "Leaving home for several weeks";
export const PROVIDED_PURPOSE =
  "To ensure no problems happen during the absence.";

// Clojure truthiness: nil/false are absent, everything else present.
const isPresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== false;

// (or prepared-list data): the threading data either holds the prepared
// essence or IS the payload-accounted record itself (the investigation
// step replaces the threading data with it).
const accountedFrom = (data: TestData): PayloadAccounted =>
  (data.preparedList ?? data) as PayloadAccounted;

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

const doeseqIsProperlySortedAndErrors = (
  response: ApiResponse,
  attempt: unknown,
): void => {
  is(
    errorsJsonProperlySorted(response.text),
    `Errors JSON is not properly sorted: ${response.text}`,
  );
  isErrors(attempt);
};

When("I want to create a new svernik", (data: TestData): TestData => data);

And("I provide a name", (data: TestData): TestData => ({
  ...data,
  [NAME]: PROVIDED_NAME,
}));

And("I provide a name with length: {int}", (data: TestData, nameLength: number): TestData => ({
  ...data,
  [NAME]: createRandomString(nameLength),
}));

And("I provide a purpose with length: {int}", (data: TestData, purposeLength: number): TestData => ({
  ...data,
  [PURPOSE]: createRandomString(purposeLength),
}));

Then("I successfully create a properly sorted svernik", async (data: TestData): Promise<TestData> => {
  const svernikResponse = await requestListCreation(data, sessionTokenOf(data));
  const svernik = parseBodyFromJson(svernikResponse);
  is(
    equalsValue(svernikResponse.status, CREATED),
    `Expected HTTP ${CREATED}, got ${svernikResponse.status}.`,
  );
  is(
    essenceJsonProperlySorted(svernikResponse.text),
    `Created svernik JSON is not properly sorted: ${svernikResponse.text}`,
  );
  isSvernik(svernik);
  return { ...data, preparedList: svernik as Record<string, unknown> };
});

And("I provide a purpose", (data: TestData): TestData => ({
  ...data,
  [PURPOSE]: PROVIDED_PURPOSE,
}));

Then("my attempt to create a svernik fails", async (data: TestData): Promise<TestData> => {
  const listsData = (data.lists as TestData[] | undefined) ?? [data];
  const failedCreationResponses: ApiResponse[] = [];
  for (const listData of listsData) {
    failedCreationResponses.push(
      await requestListCreation(listData, sessionTokenOf(data)),
    );
  }
  const failedCreationAttempts = failedCreationResponses.map(parseBodyFromJson);
  const statuses = new Set(failedCreationResponses.map((response) => response.status));
  const status = failedCreationResponses[0]?.status;
  is(
    equalsValue(statuses.size, 1),
    `Expected a single creation failure status, got: ${JSON.stringify([...statuses])}.`,
  );
  is(
    equalsValue(status, BAD_REQUEST),
    `Expected HTTP ${BAD_REQUEST}, got ${status}.`,
  );
  doseqParallel(
    failedCreationResponses,
    failedCreationAttempts,
    doeseqIsProperlySortedAndErrors,
  );
  return { status, failedActionsAttempt: failedCreationAttempts, originalData: data };
});

Then("Svernik contains the id", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(accountedFrom(data), [ID], "svernik.domain.svernik/id");
  return data;
});

Then("Svernik contains the URL", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(accountedFrom(data), [URL_FIELD], "svernik.domain.with-URL/URL");
  return data;
});

Then("Svernik contains the type", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(accountedFrom(data), [TYPE], "svernik.domain.svernik/type");
  return data;
});

Then("Svernik contains date and time of creation", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    accountedFrom(data),
    [CREATED_AT],
    "svernik.domain.with-created-at/created-at",
  );
  return data;
});

Then("Svernik contains the provided name", (data: TestData): TestData => {
  const accounted = accountedFrom(data);
  const name = (accounted.payload as Record<string, unknown>)[NAME];
  isEssenceAccountedFieldValid(accounted, [NAME], "svernik.domain.svernik/name");
  is(
    equalsValue(name, PROVIDED_NAME) || equalsValue(name, PROVIDED_NAME_UPDATE),
    `Expected the provided name, got: ${JSON.stringify(name)}.`,
  );
  return data;
});

Then("Svernik contains the provided purpose", (data: TestData): TestData => {
  const accounted = accountedFrom(data);
  if (isPresent(accounted.payload)) {
    isEssenceAccountedFieldValid(accounted, [PURPOSE], "svernik.domain.svernik/purpose");
  }
  const svernik = (accounted.payload ?? accounted) as Record<string, unknown>;
  const purpose = svernik[PURPOSE];
  is(
    equalsValue(purpose, PROVIDED_PURPOSE) ||
      equalsValue(purpose, PROVIDED_PURPOSE_UPDATE),
    `Expected the provided purpose, got: ${JSON.stringify(purpose)}.`,
  );
  return data;
});

Then("Created svernik contains purpose in its default state", (data: TestData): TestData => {
  const accounted = (data.preparedList ?? data) as Record<string, unknown>;
  is(
    equalsValue(accounted[PURPOSE], PURPOSE_DEFAULT),
    `Expected the purpose in its default state (${JSON.stringify(PURPOSE_DEFAULT)}), got: ${JSON.stringify(accounted[PURPOSE])}.`,
  );
  return data;
});

But("I provide the absent, empty or incorrect name: {}", (data: TestData, name: string): TestData =>
  assocParsedFromJsonIfNotAbsent(data, NAME, name));

And("I provide the following absent or empty purpose: {}", (data: TestData, purpose: string): TestData =>
  isPresent(data.svernikData)
    ? assocInParsedFromJsonIfNotAbsent(data, ["svernikData", PURPOSE], purpose)
    : assocParsedFromJsonIfNotAbsent(data, PURPOSE, purpose));

But("I provide incorrect purpose: {}", (data: TestData, purpose: string): TestData =>
  isPresent(data.svernikData)
    ? assocInConvertedToJson(data, ["svernikData", PURPOSE], purpose)
    : assocConvertedToJson(data, PURPOSE, purpose));

Then("I see the following error: {string}", (data: TestData, errorMessageType: string): TestData => {
  doseqIsFailedActionsAttempt(
    data as { failedActionsAttempt: unknown[] },
    [errorMessageType],
  );
  return data;
});

Then("Svernik contains the version id equal to the id", (data: TestData): TestData => {
  const accounted = accountedFrom(data);
  isEssenceAccountedFieldValid(accounted, [VERSION_ID], "svernik.domain.svernik/version-id");
  is(
    equalsValue(accounted.getField([VERSION_ID]), accounted.getField([ID])),
    `Expected the version id to equal the id, got ${JSON.stringify(accounted.getField([VERSION_ID]))} vs ${JSON.stringify(accounted.getField([ID]))}.`,
  );
  return data;
});

Then("Svernik contains the older version id in its default state", (data: TestData): TestData => {
  const accounted = accountedFrom(data);
  isEssenceAccountedFieldValid(
    accounted,
    ["olderVersionId"],
    "svernik.domain.svernik/older-version-id",
  );
  is(
    equalsValue(OLDER_VERSION_ID_DEFAULT, accounted.getField(["olderVersionId"])),
    `Expected the older version id in its default state, got: ${JSON.stringify(accounted.getField(["olderVersionId"]))}.`,
  );
  return data;
});

Then("Svernik contains the newer version id in its default state", (data: TestData): TestData => {
  const accounted = accountedFrom(data);
  isEssenceAccountedFieldValid(
    accounted,
    ["newerVersionId"],
    "svernik.domain.svernik/newer-version-id",
  );
  is(
    equalsValue(NEWER_VERSION_ID_DEFAULT, accounted.getField(["newerVersionId"])),
    `Expected the newer version id in its default state, got: ${JSON.stringify(accounted.getField(["newerVersionId"]))}.`,
  );
  return data;
});
