// Ported from
// features/svernik_deleting/svernik_deleting_non_existing_steps.clj
// — complete.
import { Then, When, type TestData } from "../../support/world.ts";
import {
  attemptToHandleEssenceReturnStatusAndErrors,
  type StatusAndErrors,
} from "../../utilities/requestEssence.ts";
import {
  attemptToDeleteListReturnStatusAndErrors,
  requestListDeletion,
} from "../../utilities/requestList.ts";
import {
  INCORRECT_SVERNIK_ID,
  UNAVAILABLE_SVERNIK_ID,
} from "../../utilities/sharedConstants.ts";

const sessionTokenOf = (data: TestData): string | undefined =>
  (data.auth as { sessionToken?: string } | undefined)?.sessionToken;

When("I try to delete svernik without providing the id", (data: TestData): TestData => ({
  ...data,
  id: "",
}));

Then("my request is interpreted as an attempt to delete /lists", async (data: TestData): Promise<StatusAndErrors> =>
  attemptToHandleEssenceReturnStatusAndErrors(
    await requestListDeletion(sessionTokenOf(data), data.id as string, null),
  ));

When("I try to delete a list using the incorrect id", (data: TestData): TestData => ({
  ...data,
  id: INCORRECT_SVERNIK_ID,
}));

Then("my attempt to delete a list fails", async (data: TestData): Promise<StatusAndErrors> =>
  attemptToDeleteListReturnStatusAndErrors(sessionTokenOf(data), data.id as string, null));

When("I try to delete a non-existing svernik", (data: TestData): TestData => ({
  ...data,
  id: UNAVAILABLE_SVERNIK_ID,
}));
