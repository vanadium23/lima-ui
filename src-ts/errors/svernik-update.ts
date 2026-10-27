// List-update error gatherers (ET-220). Mirrors
// src/svernik/errors/svernik_name_errors_gatherer.clj
// (gather-name-update-errors), svernik_purpose_errors_gatherer.clj
// (gather-purpose-update-errors), svernik_note_errors_gatherer.clj
// (gather-note-errors),
// svernik-reason-for-latest-update-errors-gatherer.clj,
// svernik/errors/utilities/reasons_errors_handling.clj,
// svernik/utilities/essence_update_repeats_current_content.clj and
// svernik/errors/svernik.id-errors-gatherer.clj. One error max per
// gatherer, first firing check wins (utilities.clj gather-field-errors).
import type { RawEssence } from "../domain/svernik.ts";
import {
  isListId,
  isString,
  NAME,
  NAME_MAX_LENGTH,
  NOTE,
  NOTE_MAX_LENGTH,
  PURPOSE,
  PURPOSE_MAX_LENGTH,
  REASON_FOR_LATEST_UPDATE,
} from "../domain/svernik.ts";
import { NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD } from "../domain/fields.ts";
import {
  emptyAsStringValue,
} from "../domain/svernik-build.ts";
import {
  emptyAsString,
  formatTemplate,
  gatherFieldErrorsSync,
  missing,
  tooLongString,
  type ValidationCheck,
} from "./gather.ts";
import { LIST_ERRORS } from "./svernik-errors.ts";
import type { EssenceError } from "./svernik-errors.ts";
import { someAndIncorrect } from "./svernik-name-purpose-note.ts";

// reasons-errors-handling.clj mark-of-reason-missing-false-or-nil?:
// the mark key is absent, or present as false or null.
const markMissingFalseOrNil = (data: RawEssence): boolean => {
  if (!(NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD in data)) {
    return true;
  }
  const mark = data[NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD];
  return mark === false || mark === null;
};

// reasons-errors-handling.clj mark-of-reason-incorrect?: present AND
// (NOT missing/false/nil) AND not a boolean.
const markOfReasonIncorrect = (data: RawEssence): boolean =>
  !markMissingFalseOrNil(data) && typeof data[
    NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD
  ] !== "boolean";

// reason-incorrect?: key present AND NOT reason-empty? AND not a
// string (reasons_errors_handling.clj reason-incorrect? +
// incorrect.clj incorrect? with the :reason spec = plain string?).
const reasonIncorrect = (data: RawEssence, field: string): boolean =>
  field in data &&
  !emptyAsStringValue(data[field]) &&
  !isString(data[field]);

// essence-update-repeats-current-data? — STRUCTURAL equality (Clojure
// `=`): the payload here is JSON-only (objects, arrays, scalars), so
// stableStringify comparison reproduces it. When :reason is present
// the :mark is dropped from the comparison. nil current → false.
export const updateRepeatsCurrentData = (
  currentEssence: RawEssence | null,
  updateData: RawEssence,
  stringify: (value: unknown) => string,
): boolean => {
  if (currentEssence === null) {
    return false;
  }
  const filtered = { ...updateData };
  if (REASON_FOR_LATEST_UPDATE in filtered) {
    delete filtered[NO_DOCUMENTED_REASON_FOR_LATEST_UPDATE_FIELD];
  }
  const keys = Object.keys(filtered);
  if (keys.length === 0) {
    return false;
  }
  return keys.every((key) => {
    const current: unknown = currentEssence[key];
    const incoming: unknown = filtered[key];
    if (current === null || current === undefined) {
      return incoming === null || incoming === undefined;
    }
    if (incoming === null || incoming === undefined) {
      return false;
    }
    return stringify(current) === stringify(incoming);
  });
};

// gather-svernik-id-update-errors: contains-and-incorrect? on :id vs
// the list-id regex; the error demonstrates the provided id
// (specify-id-demonstrating-error).
export const gatherSvernikIdUpdateErrors = (
  updateData: RawEssence,
): EssenceError[] =>
  gatherFieldErrorsSync(updateData, [
    [
      (data) => "id" in data && !isListId(data.id),
      (data) => ({
        id: LIST_ERRORS.listIdIncorrect.id,
        text: formatTemplate(
          LIST_ERRORS.listIdIncorrect.template,
          "",
          String(data.id),
        ),
      }),
    ],
  ]);

// Update-name gatherer: EMPTY → INCORRECT → TOO-LONG (no missing).
export const gatherNameUpdateErrors = (rawData: RawEssence): EssenceError[] =>
  gatherFieldErrorsSync(rawData, [
    [(data) => emptyAsString(data, NAME), LIST_ERRORS.nameEmpty],
    [
      (data) => NAME in data && !isString(data[NAME]),
      LIST_ERRORS.nameIncorrect,
    ],
    [
      (data) => tooLongString(data, NAME, NAME_MAX_LENGTH),
      LIST_ERRORS.nameTooLong,
    ],
  ]);

export const gatherPurposeUpdateErrors = (
  rawData: RawEssence,
): EssenceError[] =>
  gatherFieldErrorsSync(rawData, [
    [(data) => reasonIncorrect(data, PURPOSE), LIST_ERRORS.purposeIncorrect],
    [
      (data) => tooLongString(data, PURPOSE, PURPOSE_MAX_LENGTH),
      LIST_ERRORS.purposeTooLong,
    ],
  ]);

export const gatherNoteUpdateErrors = (rawData: RawEssence): EssenceError[] =>
  gatherFieldErrorsSync(rawData, [
    [
      (data) => someAndIncorrect(data, NOTE),
      LIST_ERRORS.noteIncorrect,
    ],
    [
      (data) => tooLongString(data, NOTE, NOTE_MAX_LENGTH),
      LIST_ERRORS.noteTooLong,
    ],
  ]);

// reason-for-latest-update-incorrect? → mark-incorrect? →
// missing-without-mark? → empty-without-mark? — exactly the order of
// the Clojure check vector.
export const gatherReasonUpdateErrors = (
  rawData: RawEssence,
): EssenceError[] =>
  gatherFieldErrorsSync(rawData, [
    [
      (data) => reasonIncorrect(data, REASON_FOR_LATEST_UPDATE),
      LIST_ERRORS.reasonForLatestUpdateIncorrect,
    ],
    [markOfReasonIncorrect, LIST_ERRORS.noDocumentedReasonForLatestUpdateIncorrect],
    [
      (data) =>
        missing(data, REASON_FOR_LATEST_UPDATE) &&
        markMissingFalseOrNil(data),
      LIST_ERRORS.reasonForLatestUpdateMissingWithoutMark,
    ],
    [
      (data) =>
        emptyAsStringValue(data[REASON_FOR_LATEST_UPDATE]) &&
        REASON_FOR_LATEST_UPDATE in data &&
        markMissingFalseOrNil(data),
      LIST_ERRORS.reasonForLatestUpdateEmptyWithoutMark,
    ],
  ]);
