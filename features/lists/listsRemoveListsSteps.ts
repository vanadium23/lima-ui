import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import {
  ADDRESSES_MEANINGS,
  type AddressMeaning,
} from "../../utilities/addresses.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  BUTTON_TEST_IDS,
  type ButtonMeaning,
} from "../listCreation/testIds.ts";
import {
  DEFAULT_TEST_ID,
  LIST_STRIPE,
  type WarningMeaning,
  WARNINGS_TEST_IDS,
} from "../testIds.ts";
import { TEST_SUB_ID_ATTRIBUTE } from "../utilities/buildTestableSelector.ts";

import {
  DIALOG_TEST_IDS,
  type DialogMeaning,
  LINK_TEST_IDS,
  type LinkMeaning,
  LIST_STRIPE_POSITIONS,
  type ListStripePosition,
} from "./testIds.ts";

When(
  "I hover {string} list stripe",
  async function (this: ComplexWorld, listStripePosition: ListStripePosition) {
    const listStripe = this.locate(LIST_STRIPE).nth(
      LIST_STRIPE_POSITIONS[listStripePosition],
    );

    await listStripe.hover();
  },
);

When(
  "I press the visible {string} button",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    const button = this.locateVisible(`${BUTTON_TEST_IDS[buttonMeaning]}`);
    this.data.clickedButtonTestSubId =
      (await button.getAttribute(TEST_SUB_ID_ATTRIBUTE)) || "";

    await button.click();
  },
);

Then(
  "I expect to see the {string} dialog modal box",
  async function (this: ComplexWorld, dialogMeaning: DialogMeaning) {
    const expectDialog = this.expectLocatedVisible(
      DIALOG_TEST_IDS[dialogMeaning],
    );

    await expectDialog.toBeInViewport();
    // MAKSIM: Это достаточная проверка модальности?
    await expectDialog.toHaveAttribute("open");
    await expectDialog.toHaveAttribute("aria-modal", "true");
  },
);

Then(
  "I expect not to see the {string} dialog modal box",
  { timeout: 500 },
  async function (this: ComplexWorld, dialogMeaning: DialogMeaning) {
    const dialogs = this.locate(DIALOG_TEST_IDS[dialogMeaning]);

    for (const dialog of await dialogs.all()) {
      await expect(dialog).not.toBeInViewport();
    }
  },
);

When(
  "I click outside of the {string} dialog modal box",
  async function (this: ComplexWorld, dialogMeaning: DialogMeaning) {
    await this.locate(
      DIALOG_TEST_IDS[dialogMeaning],
      this.data.clickedButtonTestSubId,
    ).click({
      position: { x: -10, y: -10 },
    });
  },
);

Then(
  "I expect to see the visible {string} button disabled",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    await this.expectLocated(BUTTON_TEST_IDS[buttonMeaning]).toBeDisabled();
  },
);

Then(
  "I expect to see the visible {string} list stripe {string} link disabled",
  async function (
    this: ComplexWorld,
    listStripePosition: ListStripePosition,
    linkMeaning: LinkMeaning,
  ) {
    const listId =
      this.listIds[LIST_STRIPE_POSITIONS[listStripePosition]] ||
      DEFAULT_TEST_ID;

    const listStripeLink = this.locateVisible(
      LINK_TEST_IDS[linkMeaning],
      listId,
    );

    await expect(listStripeLink).toHaveAttribute("href", "#");
  },
);

Then(
  "I expect to see the visible {string} list stripe {string} button disabled",
  async function (
    this: ComplexWorld,
    listStripePosition: ListStripePosition,
    buttonMeaning: ButtonMeaning,
  ) {
    const listId =
      this.listIds[LIST_STRIPE_POSITIONS[listStripePosition]] ||
      DEFAULT_TEST_ID;

    const listStripeLink = this.locateVisible(
      BUTTON_TEST_IDS[buttonMeaning],
      listId,
    );

    await expect(listStripeLink).toBeDisabled();
  },
);

Then(
  "I forcefully press the {string} list stripe {string} button",
  async function (
    this: ComplexWorld,
    listStripePosition: ListStripePosition,
    buttonMeaning: ButtonMeaning,
  ) {
    const listId =
      this.listIds[LIST_STRIPE_POSITIONS[listStripePosition]] ||
      DEFAULT_TEST_ID;

    await this.locateVisible(BUTTON_TEST_IDS[buttonMeaning], listId).click({
      force: true,
    });
  },
);

When(
  "I start waiting for the {string} request to happen",
  async function (this: ComplexWorld, addressMeaning: AddressMeaning) {
    this.responsesToWait[addressMeaning] = this.page.waitForResponse(
      `**${ADDRESSES_MEANINGS[addressMeaning].address}`,
    );
  },
);

When(
  "I wait for the {string} request to happen",
  async function (this: ComplexWorld, addressMeaning: AddressMeaning) {
    await this.responsesToWait[addressMeaning];
  },
);

Then(
  "I expect not to see the {string} warning",
  async function (this: ComplexWorld, warningMeaning: WarningMeaning) {
    await this.expectLocated(
      WARNINGS_TEST_IDS[warningMeaning],
    ).not.toBeInViewport();
  },
);
