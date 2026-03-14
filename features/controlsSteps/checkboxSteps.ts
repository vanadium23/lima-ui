import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import { IMPORT_DIALOG_LIST_CHECKBOX } from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";

const CHECKBOX_TEST_IDS = {
  "first import list": buildFullTestId(IMPORT_DIALOG_LIST_CHECKBOX, 0),
  "second import list": buildFullTestId(IMPORT_DIALOG_LIST_CHECKBOX, 1),
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
