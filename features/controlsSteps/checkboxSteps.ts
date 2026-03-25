import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import { LIST_STRIPE_IMPORT_CHECKBOX, LIST_STRIPE_IMPORT_ITEM_CHECKBOX } from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";

const CHECKBOX_TEST_IDS = {
  "first import list": buildFullTestId(LIST_STRIPE_IMPORT_CHECKBOX, 0),
  "second import list": buildFullTestId(LIST_STRIPE_IMPORT_CHECKBOX, 1),
  "third import list": buildFullTestId(LIST_STRIPE_IMPORT_CHECKBOX, 2),
  "first import item": buildFullTestId(LIST_STRIPE_IMPORT_ITEM_CHECKBOX, 0),
  "second import item": buildFullTestId(LIST_STRIPE_IMPORT_ITEM_CHECKBOX, 1),
};

type CheckboxMeaning = keyof typeof CHECKBOX_TEST_IDS;

When("I check the {string} checkbox", async function (this: ComplexWorld, checkboxMeaning: CheckboxMeaning) {
  const checkbox = this.locateByFullId(CHECKBOX_TEST_IDS[checkboxMeaning]);
  const checkboxInput = checkbox.locator("input");

  if (!(await checkboxInput.isChecked())) {
    await checkbox.click();
  }
});

When("I uncheck the {string} checkbox", async function (this: ComplexWorld, checkboxMeaning: CheckboxMeaning) {
  const checkbox = this.locateByFullId(CHECKBOX_TEST_IDS[checkboxMeaning]);
  const checkboxInput = checkbox.locator("input");

  if (await checkboxInput.isChecked()) {
    await checkbox.click();
  }
});

Then("I expect to see the {string} checkbox", async function (this: ComplexWorld, checkboxMeaning: CheckboxMeaning) {
  await expect(this.locateByFullId(CHECKBOX_TEST_IDS[checkboxMeaning])).toBeInViewport();
});
