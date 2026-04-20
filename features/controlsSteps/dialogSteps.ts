import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import {
  buildLoadingDialogTestId,
  EDIT_IMPORTED_GROUP_DIALOG,
  IMPORT_DIALOG,
  IMPORT_DIALOG_EMPTY_MESSAGE,
  REMOVE_EXPORTED_ITEM_DIALOG,
  REMOVE_LIST_DIALOG,
} from "../testIds.ts";
import { getTimeoutOrCancelItIfDebugging } from "../utilities/getTimeoutOrCancelItIfDebugging.ts";

export const DIALOG_TEST_IDS = {
  import: IMPORT_DIALOG,
  "remove list": REMOVE_LIST_DIALOG,
  "remove exported item": REMOVE_EXPORTED_ITEM_DIALOG,
  "edit import": EDIT_IMPORTED_GROUP_DIALOG,
};
export type DialogMeaning = keyof typeof DIALOG_TEST_IDS;

export const DIALOG_LOADING_TEST_IDS: Record<DialogMeaning, string> = {
  import: buildLoadingDialogTestId(IMPORT_DIALOG),
  "remove list": buildLoadingDialogTestId(REMOVE_LIST_DIALOG),
  "remove exported item": "",
  "edit import": "",
};

export const DIALOG_EMPTY_MESSAGE_TEST_IDS: Record<DialogMeaning, string> = {
  import: IMPORT_DIALOG_EMPTY_MESSAGE,
  "remove list": "",
  "remove exported item": "",
  "edit import": "",
};

Then(
  "I expect to see the {string} dialog modal box",
  async function (this: ComplexWorld, dialogMeaning: DialogMeaning) {
    const expectDialog = this.expectLocatedVisible(DIALOG_TEST_IDS[dialogMeaning]);

    await expectDialog.toBeInViewport();
    await expectDialog.toHaveAttribute("open");
    await expectDialog.toHaveAttribute("aria-modal", "true");
  },
);

Then("I expect to see the {string} dialog loading", async function (this: ComplexWorld, _dialogMeaning: DialogMeaning) {
  await this.expectLocated(DIALOG_LOADING_TEST_IDS[_dialogMeaning]).toBeInViewport();
});

Then(
  "I expect to see the {string} dialog empty message",
  async function (this: ComplexWorld, dialogMeaning: DialogMeaning) {
    await this.expectLocated(DIALOG_EMPTY_MESSAGE_TEST_IDS[dialogMeaning]).toBeInViewport();
  },
);

Then(
  "I expect not to see the {string} dialog modal box",
  { timeout: getTimeoutOrCancelItIfDebugging(1000) },
  async function (this: ComplexWorld, dialogMeaning: DialogMeaning) {
    const dialogs = this.locateByIdParts(DIALOG_TEST_IDS[dialogMeaning]);

    for (const dialog of await dialogs.all()) {
      await expect(dialog).not.toBeInViewport();
    }
  },
);
