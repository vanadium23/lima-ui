// The four list-field error gatherers under one create-time
// orchestration. Mirrors src/svernik/sverniks/create.clj gather-errors:
// (juxt name purpose note items) — name first, then purpose, note,
// items; flattened into ONE errors array.
import type { RawEssence } from "../domain/svernik.ts";
import {
  gatherNoteErrors,
  gatherNameCreationErrors,
  gatherPurposeErrors,
} from "./svernik-name-purpose-note.ts";
import {
  gatherItemsCreationErrors,
  type ReferenceContext,
} from "./svernik-items.ts";
import type { EssenceError } from "./svernik-errors.ts";

export const gatherSvernikCreationErrors = async (
  rawData: RawEssence,
  context: ReferenceContext,
): Promise<EssenceError[]> => [
  ...gatherNameCreationErrors(rawData),
  ...gatherPurposeErrors(rawData),
  ...(await gatherNoteErrors(rawData)),
  ...(await gatherItemsCreationErrors(rawData, context)),
];
