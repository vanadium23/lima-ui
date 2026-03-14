import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { TESTS_URL_ERROR_SIGN } from "../../../utilities/addresses.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import { LIST_ITEM_INPUT } from "../../testIds.ts";
import { INPUT_TEST_IDS, type InputMeaning } from "../listCreation/testIds.ts";

Then("I expect to see the {string} input enabled", async function (this: ComplexWorld, inputMeaning: InputMeaning) {
  const expectInput = this.expectLocated(this.accounting.elements.registerTestId(INPUT_TEST_IDS[inputMeaning]));

  await expectInput.toBeInViewport();
  await expectInput.toBeEnabled();
});

Then("I expect to see the {string} input", async function (this: ComplexWorld, inputMeaning: InputMeaning) {
  await this.expectLocated(INPUT_TEST_IDS[inputMeaning]).toBeInViewport();
});

Then("I expect not to see the last item input", async function (this: ComplexWorld) {
  await expect(this.locateByIdParts(LIST_ITEM_INPUT).last()).not.toBeInViewport();
});

When("Error happens while loading", async function (this: ComplexWorld) {
  const currentUrl = this.page.url();
  await this.page.goto(currentUrl + TESTS_URL_ERROR_SIGN);
});
