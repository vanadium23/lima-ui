// List-level error gatherers. Mirrors src/svernik/errors/
// svernik_name_errors_gatherer.clj, svernik_purpose_errors_gatherer.clj
// and svernik_note_errors_gatherer.clj — SAME check order, ONE error
// max. (The items half lives in svernik-items.ts.)
import {
  isNotEmptyString,
  isString,
  NAME,
  NOTE,
  PURPOSE,
  NAME_MAX_LENGTH,
  NOTE_MAX_LENGTH,
  PURPOSE_MAX_LENGTH,
  type RawEssence,
} from "../domain/svernik.ts";
import {
  emptyAsString,
  gatherFieldErrorsSync,
  isNonString,
  missing,
  tooLongString,
  type ValidationCheck,
} from "./gather.ts";
import { LIST_ERRORS } from "./svernik-errors.ts";
import type { EssenceError } from "./svernik-errors.ts";

// name: missing → empty → incorrect → too-long.
export const gatherNameCreationErrors = (
  rawData: RawEssence,
): EssenceError[] => {
  const checks: ValidationCheck[] = [
    [(data) => missing(data, NAME), LIST_ERRORS.nameMissing],
    [(data) => emptyAsString(data, NAME), LIST_ERRORS.nameEmpty],
    [
      (data) => NAME in data && !isNotEmptyString(data[NAME]),
      LIST_ERRORS.nameIncorrect,
    ],
    [
      (data) => tooLongString(data, NAME, NAME_MAX_LENGTH),
      LIST_ERRORS.nameTooLong,
    ],
  ];
  return gatherFieldErrorsSync(rawData, checks);
};

// reason-incorrect?: present AND not reason-empty AND not a string.
// reason-empty? = empty-as-string?. For purpose: `{}` → str "{}" is
// not empty and not a string → incorrect. `""`/nil → empty (no error at
// creation — the field is optional).
export const reasonIncorrect = (
  rawData: RawEssence,
  field: string,
): boolean => {
  if (!(field in rawData)) {
    return false;
  }
  if (emptyAsString(rawData, field)) {
    return false;
  }
  return !isString(rawData[field]);
};

// purpose: incorrect → too-long.
export const gatherPurposeErrors = (rawData: RawEssence): EssenceError[] =>
  gatherFieldErrorsSync(rawData, [
    [(data) => reasonIncorrect(data, PURPOSE), LIST_ERRORS.purposeIncorrect],
    [
      (data) => tooLongString(data, PURPOSE, PURPOSE_MAX_LENGTH),
      LIST_ERRORS.purposeTooLong,
    ],
  ]);

// note-incorrect?: some? (present, non-nil) AND not a string.
// `""` → some? true, string → ok. nil → some? false → no error.
export const someAndIncorrect = (
  rawData: RawEssence,
  field: string,
): boolean => field in rawData && rawData[field] !== null &&
  isNonString(rawData[field]);

// note: incorrect → too-long.
export const gatherNoteErrors = (rawData: RawEssence): EssenceError[] =>
  gatherFieldErrorsSync(rawData, [
    [(data) => someAndIncorrect(data, NOTE), LIST_ERRORS.noteIncorrect],
    [
      (data) => tooLongString(data, NOTE, NOTE_MAX_LENGTH),
      LIST_ERRORS.noteTooLong,
    ],
  ]);

