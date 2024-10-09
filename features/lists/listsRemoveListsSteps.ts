import { Then, When } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  DIALOG_TEST_IDS,
  DIALOG_TEST_SUB_IDS,
  type DialogMeaning,
  LIST_STRIPE_TEST_IDS,
  type ListStripeMeaning,
} from "./testIds.ts";
import { LIST_STRIPE } from "../testIds.ts";
import {
  BUTTON_TEST_IDS,
  type ButtonMeaning,
} from "../listCreation/testIds.ts";

When(
  "I hover {string} list stripe",
  async function (this: ComplexWorld, listStripeMeaning: ListStripeMeaning) {
    const listStripe = this.locate(LIST_STRIPE).nth(
      LIST_STRIPE_TEST_IDS[listStripeMeaning],
    );

    await listStripe.hover();
  },
);

When(
  "I press the visible {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.locate(`${BUTTON_TEST_IDS[buttonMeaning]}`)
      .locator("visible=true")
      .click();
  },
);

Then(
  "I expect to see the {string} dialog modal box",
  async function (this: ComplexWorld, dialogMeaning: DialogMeaning) {
    const expectDialog = this.expectLocatedByIdParts(
      DIALOG_TEST_IDS[dialogMeaning],
      this.data[DIALOG_TEST_SUB_IDS[dialogMeaning]] || "",
    );

    await expectDialog.toBeInViewport();
    // MAKSIM: Это достаточная проверка модальности?
    await expectDialog.toHaveAttribute("open");
    await expectDialog.toHaveAttribute("aria-modal", "true");
  },
);

Then(
  "I expect not to see the {string} dialog modal box",
  async function (this: ComplexWorld, dialogMeaning: DialogMeaning) {
    const expectDialog = this.expectLocatedByIdParts(
      DIALOG_TEST_IDS[dialogMeaning],
      this.data[DIALOG_TEST_SUB_IDS[dialogMeaning]] || "",
    );

    await expectDialog.not.toBeInViewport();
  },
);
