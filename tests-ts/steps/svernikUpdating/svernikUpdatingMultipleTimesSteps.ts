// Ported from
// features/svernik_updating/svernik_updating_multiple_times_steps.clj
// — complete.
import { randomInt } from "node:crypto";

import { And, Then, is, equalsValue, type TestData } from "../../support/world.ts";
import {
  CONTENT,
  ITEMS,
  NAME,
  NOTE,
  PURPOSE,
  REASON_FOR_LATEST_UPDATE,
} from "../../../src-ts/domain/svernik.ts";
import { buildRandomBoolean, buildRandomString } from "../../utilities/buildRandom.ts";
import { essenceJsonProperlySorted } from "../../utilities/properlySortedJson.ts";
import { requestListUpdateParsed } from "../../utilities/requestList.ts";
import { SEEMINGLY_OKAY_LIMIT_OF_UPDATES } from "../../utilities/sharedConstants.ts";
import { isSvernik } from "../../utilities/validators.ts";

And("I consequently update svernik some random number of times", async (data: TestData): Promise<TestData> => {
  const token = (data.auth as { sessionToken?: string } | undefined)?.sessionToken;
  const svernikUpdatesResults: unknown[] = [];
  // (rand-int SEEMINGLY_OKAY_LIMIT_OF_UPDATES): 0..99, possibly zero.
  const updatesCount = randomInt(SEEMINGLY_OKAY_LIMIT_OF_UPDATES);
  for (let index = 0; index < updatesCount; index += 1) {
    let updateData: Record<string, unknown> = {
      [REASON_FOR_LATEST_UPDATE]: buildRandomString(),
      [ITEMS]: [{ [CONTENT]: buildRandomString() }],
    };
    if (buildRandomBoolean()) {
      updateData = { ...updateData, [NAME]: buildRandomString() };
    }
    if (buildRandomBoolean()) {
      updateData = { ...updateData, [PURPOSE]: buildRandomString() };
    }
    if (buildRandomBoolean()) {
      updateData = { ...updateData, [NOTE]: buildRandomString() };
    }
    svernikUpdatesResults.push(
      await requestListUpdateParsed(token, data.id as string, updateData),
    );
  }
  return { svernikUpdatesResults };
});

Then("On any update I see properly sorted updated version of the svernik", (data: TestData): TestData => {
  for (const result of data.svernikUpdatesResults as {
    preparedList: unknown;
    updatedSvernikJson: string;
  }[]) {
    is(
      essenceJsonProperlySorted(result.updatedSvernikJson),
      `Updated svernik JSON is not properly sorted: ${result.updatedSvernikJson}`,
    );
    isSvernik(result.preparedList);
  }
  return data;
});

Then("On every update I see the following HTTP status code: {int}", (data: TestData, expectedHttpStatusCode: number): TestData => {
  const updateResults = (data.svernikUpdatesResults ??
    data.itemsUpdatesResults ??
    []) as { status: number }[];
  for (const result of updateResults) {
    is(
      equalsValue(expectedHttpStatusCode, result.status),
      `Expected HTTP ${expectedHttpStatusCode}, got ${result.status}.`,
    );
  }
  return data;
});
