// Ported from features/svernik_exploring/sverniks_exploring_steps.clj
// — complete.
import { Then, When, equalsValue, is, isEqual, type TestData } from "../../support/world.ts";
import { NEWER_VERSION_ID_DEFAULT, NOTE_DEFAULT } from "../../../src-ts/domain/svernik.ts";
import type { ApiResponse } from "../../support/http.ts";
import {
  ESSENCE_FIELD_SPECIFICATIONS,
  isSvernik,
  isSvernikValue,
  isWithDocumentedReasonForLatestUpdate,
  isWithoutDocumentedReasonForLatestUpdate,
} from "../../utilities/validators.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import { isThatAllFieldsInEssenceOverviewed } from "../../utilities/isThatAllFieldsInEssenceOverviewed.ts";
import { getPayloadAccounted, type PayloadAccounted } from "../../utilities/payloadAccounted.ts";
import { requestAllListsExplorationParsed } from "../../utilities/requestList.ts";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

const listsAccountedOf = (data: TestData): PayloadAccounted =>
  data as unknown as PayloadAccounted;

// The accounted payload is the explored lists VECTOR (get-field walks
// [index field] paths over it).
const listsOf = (listsAccounted: PayloadAccounted): Record<string, unknown>[] =>
  listsAccounted.payload as unknown as Record<string, unknown>[];

// is-lists-field-valid: get-field through [index field] registers the
// field and validates it per list.
const isListsFieldValid = (
  listsAccounted: PayloadAccounted,
  field: string,
  specificationName: string,
): void => {
  for (let listIndex = 0; listIndex < listsOf(listsAccounted).length; listIndex += 1) {
    isEssenceAccountedFieldValid(listsAccounted, [String(listIndex), field], specificationName);
  }
};

const specificationOf = (specificationName: string): ((value: unknown) => boolean) => {
  const specification = ESSENCE_FIELD_SPECIFICATIONS[specificationName];
  if (specification === undefined) {
    throw new Error(`Unknown essence field specification: ${specificationName}`);
  }
  return specification;
};

When("I ask for all my lists", async (data: TestData): Promise<TestData> => {
  const listsResult = await requestAllListsExplorationParsed(sessionTokenOf(data)!);
  const response = listsResult.response as unknown as ApiResponse;
  return {
    ...data,
    status: listsResult.status,
    exploredLists: listsResult.exploredLists,
    contentLength: response.headers.get("content-length"),
  };
});

Then("I receive a collection of lists", (data: TestData): TestData => {
  for (const someList of (data.exploredLists ?? []) as unknown[]) {
    isSvernik(someList);
  }
  return data;
});

Then("I see lists' ids", (data: TestData): PayloadAccounted => {
  const listsAccounted = getPayloadAccounted(
    data.exploredLists as unknown as Record<string, unknown>,
  );
  isListsFieldValid(listsAccounted, "id", "svernik.domain.svernik/id");
  return listsAccounted;
});

Then("I see lists' names", (listsAccounted: TestData): PayloadAccounted => {
  isListsFieldValid(listsAccountedOf(listsAccounted), "name", "svernik.domain.svernik/name");
  return listsAccountedOf(listsAccounted);
});

Then("I see lists' URLs", (listsAccounted: TestData): PayloadAccounted => {
  isListsFieldValid(listsAccountedOf(listsAccounted), "URL", "svernik.domain.with-URL/URL");
  return listsAccountedOf(listsAccounted);
});

Then("I see lists' type", (listsAccounted: TestData): PayloadAccounted => {
  isListsFieldValid(listsAccountedOf(listsAccounted), "type", "svernik.domain.svernik/type");
  return listsAccountedOf(listsAccounted);
});

Then("I see lists' user ids", (listsAccounted: TestData): PayloadAccounted => {
  isListsFieldValid(
    listsAccountedOf(listsAccounted),
    "userId",
    "svernik.domain.with-user-id/user-id",
  );
  return listsAccountedOf(listsAccounted);
});

Then("I see lists' date and time of creation", (listsAccounted: TestData): PayloadAccounted => {
  isListsFieldValid(
    listsAccountedOf(listsAccounted),
    "createdAt",
    "svernik.domain.with-created-at/created-at",
  );
  return listsAccountedOf(listsAccounted);
});

Then("I see lists' purpose", (listsAccounted: TestData): PayloadAccounted => {
  isListsFieldValid(
    listsAccountedOf(listsAccounted),
    "purpose",
    "svernik.domain.svernik/purpose",
  );
  return listsAccountedOf(listsAccounted);
});

Then("I see present or empty lists' notes", (listsAccounted: TestData): PayloadAccounted => {
  const accounted = listsAccountedOf(listsAccounted);
  const noteSpecification = specificationOf("svernik.domain.with-note/note");
  for (const someList of listsOf(accounted)) {
    is(
      equalsValue(someList.note, NOTE_DEFAULT) || noteSpecification(someList.note),
      `Expected a present or empty list note, got: ${JSON.stringify(someList.note)}.`,
    );
  }
  accounted.fieldsChecked.add("note");
  return accounted;
});

Then(
  "I see lists' reasons for latest update or marks of the absence of a reason for latest update",
  (listsAccounted: TestData): PayloadAccounted => {
    const accounted = listsAccountedOf(listsAccounted);
    for (const someList of listsOf(accounted)) {
      is(
        isWithDocumentedReasonForLatestUpdate(someList) ||
          isWithoutDocumentedReasonForLatestUpdate(someList),
        `Expected a documented reason for latest update or the mark of its absence, got: ${JSON.stringify(someList)}.`,
      );
    }
    accounted.fieldsChecked.add("reasonForLatestUpdate");
    accounted.fieldsChecked.add("noDocumentedReasonForLatestUpdate");
    return accounted;
  },
);

Then("I see lists' lists of items", (listsAccounted: TestData): PayloadAccounted => {
  isListsFieldValid(
    listsAccountedOf(listsAccounted),
    "items",
    "svernik.domain.svernik/items",
  );
  return listsAccountedOf(listsAccounted);
});

Then("I see some lists' referencing lists among items", (listsAccounted: TestData): PayloadAccounted => {
  const allItems = listsOf(listsAccountedOf(listsAccounted)).flatMap(
    (someList) => (someList.items ?? []) as unknown[],
  );
  is(
    allItems.some((item) => isSvernikValue(item)),
    `Expected a referencing list among the items, got: ${JSON.stringify(allItems)}.`,
  );
  return listsAccountedOf(listsAccounted);
});

Then("I see lists' exported data", (listsAccounted: TestData): PayloadAccounted => {
  const accounted = listsAccountedOf(listsAccounted);
  isListsFieldValid(
    accounted,
    "exportedTo",
    "svernik.domain.with-exported-to/exported-to",
  );
  isListsFieldValid(
    accounted,
    "hasExportedItems",
    "svernik.domain.svernik/has-exported-items",
  );
  return accounted;
});

Then("I see lists referencing lists among exported data", (listsAccounted: TestData): PayloadAccounted => {
  const allLinks = listsOf(listsAccountedOf(listsAccounted)).flatMap(
    (someList) => (someList.exportedTo ?? []) as unknown[],
  );
  const linkToListSpecification = specificationOf("svernik.domain.link-to-list/link-to-list");
  is(
    allLinks.every((link) => linkToListSpecification(link)),
    `Expected every exported link to be a valid link to a list, got: ${JSON.stringify(allLinks)}.`,
  );
  return listsAccountedOf(listsAccounted);
});

Then("I overviewed all fields in the lists", (listsAccounted: TestData): PayloadAccounted => {
  isThatAllFieldsInEssenceOverviewed(
    listsAccountedOf(listsAccounted),
    "svernik.domain.svernik/svernik-keys",
  );
  return listsAccountedOf(listsAccounted);
});

Then("I see lists' version ids", (listsAccounted: TestData): PayloadAccounted => {
  isListsFieldValid(
    listsAccountedOf(listsAccounted),
    "versionId",
    "svernik.domain.svernik/version-id",
  );
  return listsAccountedOf(listsAccounted);
});

Then("I see lists' older version ids", (listsAccounted: TestData): PayloadAccounted => {
  isListsFieldValid(
    listsAccountedOf(listsAccounted),
    "olderVersionId",
    "svernik.domain.svernik/older-version-id",
  );
  return listsAccountedOf(listsAccounted);
});

Then("I see lists' newer version ids in their default state", (listsAccounted: TestData): PayloadAccounted => {
  const accounted = listsAccountedOf(listsAccounted);
  isListsFieldValid(
    accounted,
    "newerVersionId",
    "svernik.domain.svernik/newer-version-id",
  );
  for (const someList of listsOf(accounted)) {
    isEqual(
      someList.newerVersionId,
      NEWER_VERSION_ID_DEFAULT,
      `Expected the newer version id in its default state, got ${JSON.stringify(someList.newerVersionId)}.`,
    );
  }
  return accounted;
});
