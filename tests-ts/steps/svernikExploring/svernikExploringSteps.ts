// Ported from features/svernik_exploring/svernik_exploring_steps.clj
// — complete.
import { And, Then, When, is, isEqual, type TestData } from "../../support/world.ts";
import {
  NOTE_DEFAULT,
  REASON_FOR_LATEST_UPDATE,
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE,
} from "../../../src-ts/domain/svernik.ts";
import type { ApiResponse } from "../../support/http.ts";
import {
  isWithDocumentedReasonForLatestUpdate,
  isWithoutDocumentedReasonForLatestUpdate,
  isSvernik,
  isSvernikValue,
} from "../../utilities/validators.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import { isEssenceIdInErrorMessage } from "../../utilities/isEssenceIdInErrorMessage.ts";
import { isEssenceNotFoundReturnFailedActionsAttempt } from "../../utilities/isEssenceNotFound.ts";
import { isThatAllFieldsInEssenceOverviewed } from "../../utilities/isThatAllFieldsInEssenceOverviewed.ts";
import { getPayloadAccounted, type PayloadAccounted } from "../../utilities/payloadAccounted.ts";
import {
  deprecatedRequestListExplorationParsed,
  requestListExploration,
  requestListExplorationParsed,
} from "../../utilities/requestList.ts";
import { UNAVAILABLE_SVERNIK_ID } from "../../utilities/sharedConstants.ts";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

const payloadAccountedOf = (data: TestData): PayloadAccounted =>
  data.payloadAccounted as PayloadAccounted;

When("I ask to show me a specific list", async (data: TestData): Promise<TestData> => {
  const token = sessionTokenOf(data);
  const explored = async (id: string): Promise<unknown> =>
    (await requestListExplorationParsed(token, id)).exploredList;
  const payloadAccounted = getPayloadAccounted({
    ordinary: await explored("list-ordinary"),
    listWithNoPurpose: await explored("list-with-no-purpose"),
    listWithoutNote: await explored("list-without-note"),
    listWithNoDocumentedReasonForLatestUpdate: await explored(
      "list-with-no-documented-reason-for-latest-update",
    ),
    listWithSublist: await explored("list-with-sublist"),
  });
  return { ...data, payloadAccounted };
});

Then("It's a list", (data: TestData): TestData => {
  for (const someList of Object.values(payloadAccountedOf(data).payload)) {
    isSvernik(someList);
  }
  return data;
});

Then("I see list's id", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "id"],
    "svernik.domain.svernik/id",
  );
  return data;
});

Then("I see list's URL", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "URL"],
    "svernik.domain.with-URL/URL",
  );
  return data;
});

Then("I see list's type", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "type"],
    "svernik.domain.svernik/type",
  );
  return data;
});

Then("I see list's user id", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "userId"],
    "svernik.domain.with-user-id/user-id",
  );
  return data;
});

Then("I see list's date and time of creation", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "createdAt"],
    "svernik.domain.with-created-at/created-at",
  );
  return data;
});

Then("I see list's name", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "name"],
    "svernik.domain.svernik/name",
  );
  return data;
});

Then("I see list's purpose", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "purpose"],
    "svernik.domain.svernik/purpose",
  );
  return data;
});

Then("I see present or empty list's note", (data: TestData): TestData => {
  const payloadAccounted = payloadAccountedOf(data);
  isEssenceAccountedFieldValid(
    payloadAccounted,
    ["ordinary", "note"],
    "svernik.domain.with-note/note",
  );
  isEqual(
    payloadAccounted.getField(["listWithoutNote", "note"]),
    NOTE_DEFAULT,
    `Expected the note of the list without a note to be the default (${JSON.stringify(NOTE_DEFAULT)}), got ${JSON.stringify(payloadAccounted.getField(["listWithoutNote", "note"]))}.`,
  );
  return data;
});

Then(
  "I see list's reason for latest update or mark of the absence of a reason for latest update",
  (data: TestData): TestData => {
    const payload = payloadAccountedOf(data).payload;
    is(
      isWithDocumentedReasonForLatestUpdate(payload.ordinary),
      `Expected the ordinary list to carry a documented reason for latest update, got: ${JSON.stringify(payload.ordinary)}.`,
    );
    is(
      isWithoutDocumentedReasonForLatestUpdate(
        payload.listWithNoDocumentedReasonForLatestUpdate,
      ),
      `Expected the list to carry the mark of the absence of a reason for latest update, got: ${JSON.stringify(payload.listWithNoDocumentedReasonForLatestUpdate)}.`,
    );
    const payloadAccounted = payloadAccountedOf(data);
    payloadAccounted.fieldsChecked.add(REASON_FOR_LATEST_UPDATE);
    payloadAccounted.fieldsChecked.add(NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE);
    return data;
  },
);

Then("I see a plain list of items", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "items"],
    "svernik.domain.svernik/items",
  );
  return data;
});

Then("I can see referenced lists among items", (data: TestData): TestData => {
  const items = payloadAccountedOf(data).getField([
    "listWithSublist",
    "items",
  ]) as unknown[];
  is(
    items.some((item) => isSvernikValue(item)),
    `Expected a referenced list among the items, got: ${JSON.stringify(items)}.`,
  );
  return data;
});

Then("I overviewed all fields in a list", (data: TestData): TestData => {
  // (or payload-accounted data): fall back to the threading data itself.
  isThatAllFieldsInEssenceOverviewed(
    (data.payloadAccounted ?? data) as PayloadAccounted,
    "svernik.domain.svernik/svernik-keys",
  );
  return data;
});

Then("I ask to show me a list by the id", async (data: TestData): Promise<TestData> => {
  const source = (data.preparedList ?? data) as Record<string, unknown>;
  const result = await requestListExplorationParsed(
    sessionTokenOf(data),
    source.id as string,
  );
  return { ...data, exploredList: result.exploredList };
});

When("I ask to show me the unavailable svernik", (data: TestData): Promise<ApiResponse> =>
  requestListExploration(sessionTokenOf(data), UNAVAILABLE_SVERNIK_ID));

Then("my attempt to explore a svernik fails", (data: TestData): { failedActionsAttempt: unknown[] } =>
  isEssenceNotFoundReturnFailedActionsAttempt(data as unknown as ApiResponse));

Then("I see the unavailable svernik's id in the error message", (data: TestData): TestData => {
  isEssenceIdInErrorMessage(
    data as unknown as { failedActionsAttempt: unknown[] },
    UNAVAILABLE_SVERNIK_ID,
  );
  return data;
});

Then("I see list's version id equal to the id", (data: TestData): TestData => {
  const payloadAccounted = payloadAccountedOf(data);
  isEssenceAccountedFieldValid(
    payloadAccounted,
    ["ordinary", "versionId"],
    "svernik.domain.svernik/version-id",
  );
  for (const someList of Object.values(payloadAccounted.payload)) {
    const { id, versionId } = someList as { id: string; versionId: string };
    isEqual(
      id,
      versionId,
      `Expected the version id to equal the id, got ${JSON.stringify(versionId)} vs ${JSON.stringify(id)}.`,
    );
  }
  return data;
});

Then("I see list's older version id", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "olderVersionId"],
    "svernik.domain.svernik/older-version-id",
  );
  return data;
});

Then("I see list's newer version id", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "newerVersionId"],
    "svernik.domain.svernik/newer-version-id",
  );
  return data;
});

Then("I see list's exported data", (data: TestData): TestData => {
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "exportedTo"],
    "svernik.domain.with-exported-to/exported-to",
  );
  isEssenceAccountedFieldValid(
    payloadAccountedOf(data),
    ["ordinary", "hasExportedItems"],
    "svernik.domain.svernik/has-exported-items",
  );
  return data;
});

And("I want to do the precise investigation of the svernik", (svernik: TestData): PayloadAccounted => {
  const source = (svernik.exploredList ??
    svernik.preparedList ??
    svernik) as Record<string, unknown>;
  return getPayloadAccounted(source);
});

Then("I ask to show me list by the id", (list: TestData): Promise<ApiResponse> =>
  requestListExploration(
    sessionTokenOf(list),
    (list as Record<string, unknown>).id as string,
  ));
