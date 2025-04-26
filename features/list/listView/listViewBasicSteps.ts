import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { ERROR_SIGN } from "../../../utilities/addresses.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import {
  LIST_STRIPE_POSITIONS,
  type ListStripePosition,
} from "../../myLists/testIds.ts";
import { LIST_ITEM_INPUT, LIST_STRIPE } from "../../testIds.ts";
import {
  INPUT_TEST_IDS,
  type InputMeaning,
  SWITCH_TEST_IDS,
  type SwitchMeaning,
} from "../listCreation/testIds.ts";

Then(
  "I expect to see the {string} input enabled",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    const expectInput = this.expectLocated(
      this.accounting.elements.registerTestId(INPUT_TEST_IDS[inputMeaning]),
    );

    await expectInput.toBeInViewport();
    await expectInput.toBeEnabled();
  },
);

Then(
  "I expect to see the {string} switch enabled",
  async function (this: ComplexWorld, switchMeaning: SwitchMeaning) {
    const switchElement = this.locate(
      this.accounting.elements.registerTestId(SWITCH_TEST_IDS[switchMeaning]),
    );

    await expect(switchElement).toBeInViewport();
    await expect(switchElement.locator("input")).toBeEnabled();
  },
);

Then(
  "I expect to see the {string} switch disabled",
  async function (this: ComplexWorld, switchMeaning: SwitchMeaning) {
    const switchElement = this.locate(
      this.accounting.elements.registerTestId(SWITCH_TEST_IDS[switchMeaning]),
    );

    await expect(switchElement).toBeInViewport();
    await expect(switchElement.locator("input")).toBeDisabled();
  },
);

Then(
  "I expect to see the {string} input",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    await this.expectLocated(INPUT_TEST_IDS[inputMeaning]).toBeInViewport();
  },
);

Then(
  "I expect not to see the last item input",
  async function (this: ComplexWorld) {
    await expect(this.locate(LIST_ITEM_INPUT).last()).not.toBeInViewport();
  },
);

When(
  "I press on the {string} list stripe",
  async function (this: ComplexWorld, listStripePosition: ListStripePosition) {
    const listStripe = this.locate(LIST_STRIPE).nth(
      LIST_STRIPE_POSITIONS[listStripePosition],
    );

    await listStripe.click();
  },
);

When("Error happens while loading", async function (this: ComplexWorld) {
  const currentUrl = this.page.url();
  await this.page.goto(currentUrl + ERROR_SIGN);
});
