// Error definitions mirroring src/svernik/errors/list_errors.clj:
// ids, texts and templates (item-index + textual item representation).
export interface EssenceError {
  id: string;
  text: string;
}

export interface EssenceErrorTemplate {
  id: string;
  template: string;
}

const staticError = (id: string, text: string): EssenceError => ({ id, text });
const templateError = (id: string, template: string): EssenceErrorTemplate => ({
  id,
  template,
});

export const LIST_ERRORS = {
  listNotFound: { id: "list-not-found", text: "Svernik with id '%s' is not found." },
  nameMissing: staticError(
    "name-missing",
    "The required svernik's 'name' field is missing.",
  ),
  nameEmpty: staticError(
    "name-empty",
    "The required svernik's 'name' field is empty.",
  ),
  nameIncorrect: staticError(
    "name-incorrect",
    "The required svernik's 'name' field should be the non-empty string.",
  ),
  nameTooLong: staticError(
    "name-too-long",
    "The required list's 'name' field should be no longer than 70 characters.",
  ),
  purposeIncorrect: staticError(
    "purpose-incorrect",
    "The optional svernik's 'purpose' field should be the non-empty string.",
  ),
  purposeTooLong: staticError(
    "purpose-too-long",
    "The required list's 'purpose' field should be no longer than 150 characters.",
  ),
  noteIncorrect: staticError(
    "note-incorrect",
    "The optional svernik's 'note' field should be string.",
  ),
  noteTooLong: staticError(
    "note-too-long",
    "The required list's 'note' field should be no longer than 500 characters.",
  ),
  itemsIncorrect: staticError(
    "items-incorrect",
    "The list's 'items' field should be array.",
  ),
  itemsTooManyElements: staticError(
    "items-too-many-elements",
    "The required list's 'items' field should contain no more than 500 elements.",
  ),
  itemsMissing: staticError(
    "items-missing",
    "The required list's 'items' field is missing.",
  ),
  itemsEmpty: staticError(
    "items-empty",
    "The required list's 'items' field should contain at least one element.",
  ),
  itemIncorrect: templateError(
    "item-incorrect",
    "The item with index %d is incorrect: %s.",
  ),
  referenceEmpty: templateError(
    "reference-empty",
    "The 'id' field of the reference with index %d is empty: %s.",
  ),
  referenceIncorrect: templateError(
    "reference-incorrect",
    "The 'id' field of the reference with index %d should be the properly formatted string: %s.",
  ),
  referenceUnavailable: templateError(
    "reference-unavailable",
    "The referenced item with index %d either doesn't exist or is unavailable: %s.",
  ),
  referenceUpdateRepeatCurrent: templateError(
    "reference-update-repeat-current",
    "The proposed update for item with index %d is already reflected in the current state of item.",
  ),
  itemContentMissing: templateError(
    "item-content-missing",
    "The required item's 'content' field of item with index %d is missing: %s.",
  ),
  itemContentEmpty: templateError(
    "item-content-empty",
    "The required item's 'content' field of item with index %d is empty: %s.",
  ),
  itemContentIncorrect: templateError(
    "item-content-incorrect",
    "The required item's 'content' field of item with index %d should be the non-empty string: %s.",
  ),
  itemContentTooLong: templateError(
    "item-content-too-long",
    "The required item's 'content' field of item with index %d should be no longer than 200 symbols.",
  ),
  itemPurposeIncorrect: templateError(
    "item-purpose-incorrect",
    "The optional item's 'purpose' field of item with index %d should be string: %s.",
  ),
  itemNoteIncorrect: templateError(
    "item-note-incorrect",
    "The optional item's 'note' field of item with index %d should be string: %s.",
  ),
  itemReasonForLatestUpdateIncorrect: templateError(
    "item-reason-for-latest-update-incorrect",
    "The optional item's 'reasonForLatestUpdate' field of item with index %d should be string, if presented: %s.",
  ),
  itemNotFound: templateError(
    "item-not-found",
    "Item with id '%s' is not found.",
  ),
  itemUpdateEmpty: staticError(
    "item-update-empty",
    "No update data is provided.",
  ),
  itemUpdateRepeatsCurrentContent: staticError(
    "item-update-repeats-current-content",
    "The proposed update is already reflected in the current state of item.",
  ),
  // item-id-incorrect (list_errors.clj :137-140; TS entry added by
  // ET-208 — the standalone item PATCH route needs it).
  itemIdIncorrect: templateError(
    "item-id-incorrect",
    "The provided item's id ('%s') is incorrectly formatted.",
  ),
  // Update-specific list errors (ET-220) — verbatim from
  // src/svernik/errors/list_errors.clj:102-136.
  listUpdateEmpty: staticError(
    "list-update-empty",
    "No update data is provided.",
  ),
  listUpdateRepeatsCurrentContent: staticError(
    "list-update-repeats-current-content",
    "The proposed update is already reflected in the current state of svernik.",
  ),
  listIdIncorrect: templateError(
    "list-id-incorrect",
    "The provided svernik's id ('%s') is incorrectly formatted.",
  ),
  recursiveReferencing: templateError(
    "recursive-referencing",
    "The following reference with index %d leads to direct or indirect self-referencing, which is not allowed: %s.",
  ),
  reasonForLatestUpdateIncorrect: staticError(
    "reason-for-latest-update-incorrect",
    "When present, the conditionally required svernik's update 'reasonForLatestUpdate' field should be the non-empty string.",
  ),
  noDocumentedReasonForLatestUpdateIncorrect: staticError(
    "no-documented-reason-for-latest-update-incorrect",
    "When present, the conditionally required svernik's update 'noDocumentedReasonForLatestUpdate' field should be boolean.",
  ),
  reasonForLatestUpdateMissingWithoutMark: staticError(
    "reason-for-latest-update-missing-without-mark",
    "The conditionally required svernik's update 'reasonForLatestUpdate' field is missing and 'noDocumentedReasonForLatestUpdate' mark is either missing or false.",
  ),
  reasonForLatestUpdateEmptyWithoutMark: staticError(
    "reason-for-latest-update-empty-without-mark",
    "The conditionally required svernik's update 'reasonForLatestUpdate' field is empty and 'noDocumentedReasonForLatestUpdate' mark is either missing or false.",
  ),
  // Exported-items deletion errors (ET-223) — verbatim from
  // src/svernik/errors/list_errors.clj:179-214.
  exportedItemsDeletionMethodsMissing: staticError(
    "exported-items-deletion-methods-missing",
    "The 'exportedItemsDeletionMethods' field is required when deleting exported items during the list update.",
  ),
  exportedItemsDeletionMethodsEmpty: staticError(
    "exported-items-deletion-methods-empty",
    "The 'exportedItemsDeletionMethods' field is required when deleting exported items during the list update.",
  ),
  exportedItemsDeletionMethodsIncorrect: staticError(
    "exported-items-deletion-methods-incorrect",
    "The 'exportedItemsDeletionMethods' field must be array with deletion references when deleting exported items during the list update.",
  ),
  exportedItemDeletionMethodReferenceIncorrect: templateError(
    "exported-item-deletion-method-reference-incorrect",
    "The exported items deletion method with index %d is incorrect: %s.",
  ),
  exportedItemDeletionMethodReferenceDeletionMethodMissing: templateError(
    "exported-item-deletion-method-reference-deletion-method-missing",
    "The 'deletionMethod' field of the exported items deletion method reference with index %d is missing: %s.",
  ),
  exportedItemDeletionMethodReferenceDeletionMethodEmpty: templateError(
    "exported-item-deletion-method-reference-deletion-method-empty",
    "The 'deletionMethod' field of the exported items deletion method reference with index %d is empty: %s.",
  ),
  exportedItemDeletionMethodReferenceDeletionMethodIncorrect: templateError(
    "exported-item-deletion-method-reference-deletion-method-incorrect",
    "The 'deletionMethod' field of the exported items deletion method reference with index %d must be either 'deletion' or 'insertion': %s.",
  ),
  exportedItemDeletionMethodReferenceDuplicatedWithDifferentMethod:
    templateError(
      "exported-item-deletion-method-reference-duplicated-with-different-method",
      "The exported items deletion method reference with index %d attempts to delete the same item with a different deletion method: %s.",
    ),
  exportedItemDeletionMethodMissing: templateError(
    "exported-item-deletion-method-missing",
    "The deletion method for the exported item with id '%s' is missing in the 'exportedItemsDeletionMethods' array.",
  ),
  // List deletion errors (ET-218) — verbatim from
  // src/svernik/errors/list_errors.clj:151-178.
  deletionMethodMissingForExportedList: staticError(
    "deletion-method-missing-for-exported-list",
    "The 'deletionMethod' field is required when deleting an exported list.",
  ),
  deletionMethodEmptyForExportedList: staticError(
    "deletion-method-empty-for-exported-list",
    "The 'deletionMethod' field is required when deleting an exported list.",
  ),
  deletionMethodIncorrect: staticError(
    "deletion-method-incorrect",
    "The 'deletionMethod' field must be either 'deletion' or 'insertion'.",
  ),
  deletionInsertionWouldOverflowItems: staticError(
    "deletion-insertion-would-overflow-items",
    "The insertion deletion method cannot be used because inserting the list's items would exceed the maximum items limit in one or more importing lists.",
  ),
  deletionMethodMissingForListWithExportedItems: staticError(
    "deletion-method-missing-for-list-with-exported-items",
    "The 'deletionMethod' field is required when deleting a list with exported items.",
  ),
  deletionMethodEmptyForListWithExportedItems: staticError(
    "deletion-method-empty-for-list-with-exported-items",
    "The 'deletionMethod' field is required when deleting a list with exported items.",
  ),
  deletionMethodIncorrectForListWithExportedItems: staticError(
    "deletion-method-incorrect-for-list-with-exported-items",
    "The 'deletionMethod' field must be either 'deletion' or 'insertion' when deleting a list with exported items.",
  ),
} as const;
