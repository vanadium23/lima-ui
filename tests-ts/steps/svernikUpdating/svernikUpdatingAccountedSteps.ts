// Ported from features/svernik_updating/
// svernik_updating_accounted_steps.clj — complete.
import { Then, isEqual, type TestData } from "../../support/world.ts";
import {
  NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE,
  OLDER_VERSION_ID,
  REASON_FOR_LATEST_UPDATE,
  USER_ID,
  VERSION_ID,
} from "../../../src-ts/domain/svernik.ts";
import { isEssenceAccountedFieldValid } from "../../utilities/isEssenceFieldValid.ts";
import type { PayloadAccounted } from "../../utilities/payloadAccounted.ts";

Then("Svernik contains the version id", (svernikAccounted: TestData): TestData => {
  isEssenceAccountedFieldValid(
    svernikAccounted as unknown as PayloadAccounted,
    [VERSION_ID],
    "svernik.domain.svernik/version-id",
  );
  return svernikAccounted;
});

Then("Svernik contains the older version id", (svernikAccounted: TestData): TestData => {
  isEssenceAccountedFieldValid(
    svernikAccounted as unknown as PayloadAccounted,
    [OLDER_VERSION_ID],
    "svernik.domain.svernik/older-version-id",
  );
  return svernikAccounted;
});

Then("essence contains reason for latest update", (svernikAccounted: TestData): TestData => {
  isEssenceAccountedFieldValid(
    svernikAccounted as unknown as PayloadAccounted,
    [REASON_FOR_LATEST_UPDATE],
    "svernik.domain.with-required-reasons.default/reason-for-latest-update",
  );
  return svernikAccounted;
});

Then(
  "Svernik contains mark of the presence of a reason for latest update",
  (svernikAccounted: TestData): TestData => {
    const accounted = svernikAccounted as unknown as PayloadAccounted;
    isEssenceAccountedFieldValid(
      accounted,
      [NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE],
      "svernik.domain.with-required-reasons.default/no-documented-reason-for-latest-update",
    );
    const mark = (accounted.payload as Record<string, unknown>)[
      NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE
    ];
    isEqual(
      mark,
      false,
      `Expected the mark of the presence of a reason for latest update (false), got ${JSON.stringify(mark)}.`,
    );
    return svernikAccounted;
  },
);

Then("Svernik contains the user id", (svernikAccounted: TestData): TestData => {
  isEssenceAccountedFieldValid(
    svernikAccounted as unknown as PayloadAccounted,
    [USER_ID],
    "svernik.domain.with-user-id/user-id",
  );
  return svernikAccounted;
});
