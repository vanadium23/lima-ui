// Ported from features/svernik_creating/
// svernik_creating_with_referenced_sverniks_steps.clj — complete.
import { And, But, Then, is, isEqual, type TestData } from "../../support/world.ts";
import { ID } from "../../../src-ts/domain/svernik.ts";
import {
  addToItemsForUpdateOrCreation,
  assocSeveralInLastItem,
  getItemsInResults,
} from "../../utilities/handleItems.ts";
import {
  containsKeywordAndNot,
  getParsedSvernik,
} from "../../utilities/getParsedEssences.ts";
import { getUserId } from "../../support/seed.ts";
import { UNAVAILABLE_SVERNIK_ID } from "../../utilities/sharedConstants.ts";

// The donor redefines PROVIDED_ID locally for the svernik domain; it
// shadows the shared item constant, so it stays module-local here too.
const PROVIDED_ID = "list-ordinary";
const PROVIDED_IDS = ["list-ordinary", "list-with-no-purpose", "list-with-sublist"];

const PROVIDED_SVERNIK_FIELDS: Record<string, unknown> = {
  name: "Some name that shouldn't be here",
  purpose: "It exists to show that attempts to update the svernik this way have no effect.",
  note: "I even don't know how this could work if this was a feature. For svernik as well.",
};

// The donor's 1-arity get-parsed-svernik reads unscoped; the updating
// flow reaches these steps with the bare prepared list (no auth), so
// the seeded test user stands in for the missing auth userId.
const userIdOf = async (data: TestData): Promise<string> =>
  (data.auth as { userId?: string } | undefined)?.userId ?? getUserId();

// Donor nuance (get-items-in-results): user-provided item refs are
// stored under the STRING key "items", while the donor reads the
// KEYWORD :items that only parsed JSON responses carry — so these
// Thens always see the RESPONSE items, never the request refs. JS has
// a single key, so the refs would shadow the response: prefer the
// prepared list's items explicitly.
const itemsInResultsOf = (svernik: TestData): unknown[] => {
  const prepared = (svernik.preparedList as Record<string, unknown> | undefined)
    ?.items;
  return (
    (prepared ?? getItemsInResults(svernik as Record<string, unknown>)) ?? []
  ) as unknown[];
};

And("I provide a link to available svernik", (svernikData: TestData): TestData =>
  addToItemsForUpdateOrCreation(svernikData as Record<string, unknown>, {
    [ID]: PROVIDED_ID,
  }) as TestData);

Then("Created svernik contains another svernik", async (svernik: TestData): Promise<TestData> => {
  const items = itemsInResultsOf(svernik);
  const lastItem = items[items.length - 1];
  const expected = await getParsedSvernik(PROVIDED_ID, await userIdOf(svernik));
  isEqual(
    expected,
    lastItem,
    `Expected the last essence to be the already existing svernik, got ${JSON.stringify(lastItem)}.`,
  );
  return svernik;
});

And("I provide links to several available sverniks", (svernikData: TestData): TestData =>
  addToItemsForUpdateOrCreation(
    svernikData as Record<string, unknown>,
    PROVIDED_IDS.map((id) => ({ [ID]: id })),
  ) as TestData);

Then("Items are the already existing sverniks", async (svernik: TestData): Promise<TestData> => {
  const addedSverniks = itemsInResultsOf(svernik).slice(-PROVIDED_IDS.length);
  const expectedSverniks: unknown[] = [];
  for (const id of PROVIDED_IDS) {
    expectedSverniks.push(await getParsedSvernik(id, await userIdOf(svernik)));
  }
  isEqual(
    expectedSverniks,
    addedSverniks,
    `Expected the last essences to be the already existing sverniks, got ${JSON.stringify(addedSverniks)}.`,
  );
  return svernik;
});

But("I provide an empty or incorrect link to the svernik: {}", (svernikData: TestData, svernikLink: string): TestData =>
  addToItemsForUpdateOrCreation(svernikData as Record<string, unknown>, {
    [ID]: JSON.parse(svernikLink),
  }) as TestData);

But("I provide a link to the unavailable svernik", (svernikData: TestData): TestData =>
  addToItemsForUpdateOrCreation(svernikData as Record<string, unknown>, {
    [ID]: UNAVAILABLE_SVERNIK_ID,
  }) as TestData);

Then("Both sverniks are the already existing svernik and equal to each other", async (svernik: TestData): Promise<TestData> => {
  const [firstOfLastTwo, secondOfLastTwo] = itemsInResultsOf(svernik).slice(-2);
  const expected = await getParsedSvernik(PROVIDED_ID, await userIdOf(svernik));
  isEqual(expected, firstOfLastTwo, "Expected the second-to-last essence to be the already existing svernik.");
  isEqual(expected, secondOfLastTwo, "Expected the last essence to be the already existing svernik.");
  return svernik;
});

And("The provided svernik gets a name, purpose, and note", (svernikData: TestData): TestData =>
  assocSeveralInLastItem(svernikData as Record<string, unknown>, PROVIDED_SVERNIK_FIELDS) as TestData,
);

Then("Svernik doesn't reflect the provided fields", (svernik: TestData): TestData => {
  const source = (svernik.preparedList ?? svernik) as Record<string, unknown>;
  for (const [keyword, value] of Object.entries(PROVIDED_SVERNIK_FIELDS)) {
    is(
      containsKeywordAndNot(source, keyword, value),
      `Expected the svernik not to reflect ${keyword}, got ${JSON.stringify(source)}.`,
    );
  }
  return svernik;
});
