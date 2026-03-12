import { Then } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import {
  buildLoadingDialogTestId,
  IMPORT_DIALOG,
  IMPORT_DIALOG_EMPTY_MESSAGE,
  REMOVE_LIST_DIALOG,
} from "../testIds.ts";

export const DIALOG_TEST_IDS = {
  import: IMPORT_DIALOG,
  "remove list": REMOVE_LIST_DIALOG,
};
export type DialogMeaning = keyof typeof DIALOG_TEST_IDS;

export const DIALOG_LOADING_TEST_IDS: Record<DialogMeaning, string> = {
  import: buildLoadingDialogTestId(IMPORT_DIALOG),
  "remove list": buildLoadingDialogTestId(REMOVE_LIST_DIALOG),
};

export const DIALOG_EMPTY_MESSAGE_TEST_IDS: Record<DialogMeaning, string> = {
  import: IMPORT_DIALOG_EMPTY_MESSAGE,
  "remove list": "",
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
