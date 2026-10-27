// Ported from features/svernik_updating/svernik_updating_note_steps.clj
// — complete.
import { And, Then, isEqual, type TestData } from "../../support/world.ts";
import { NOTE, NOTE_DEFAULT } from "../../../src-ts/domain/svernik.ts";
import { assocInPath } from "../../utilities/handleRawData.ts";
import { createRandomString } from "../../utilities/buildRandom.ts";
import { PROVIDED_NOTE_UPDATE } from "../../utilities/sharedConstants.ts";

And("I provide an updated note", (essenceUpdateData: TestData): TestData =>
  assocInPath(essenceUpdateData, ["svernikData", NOTE], PROVIDED_NOTE_UPDATE));

And(
  "I provide an updated note with length: {int}",
  (essenceUpdateData: TestData, noteLength: number): TestData =>
    assocInPath(essenceUpdateData, ["svernikData", NOTE], createRandomString(noteLength)),
);

Then("Updated svernik contains the provided note", (svernikUpdateResults: TestData): TestData => {
  const note = (svernikUpdateResults.preparedList as Record<string, unknown>)[NOTE];
  isEqual(
    note,
    PROVIDED_NOTE_UPDATE,
    `Expected the provided note, got ${JSON.stringify(note)}.`,
  );
  return svernikUpdateResults;
});

Then("Updated svernik contains note in its default state", (svernikUpdateResults: TestData): TestData => {
  const note = (svernikUpdateResults.preparedList as Record<string, unknown>)[NOTE];
  isEqual(
    note,
    NOTE_DEFAULT,
    `Expected the note in its default state (${JSON.stringify(NOTE_DEFAULT)}), got ${JSON.stringify(note)}.`,
  );
  return svernikUpdateResults;
});
