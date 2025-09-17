import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { EOL } from "os";

import type { ComplexWorld } from "../../context/hooks.ts";
import { CHECKBOX, LIST_ITEM } from "../../testIds.ts";
import { buildTestableSelector } from "../../utilities/buildTestableSelector.ts";
import { SWITCH_TEST_IDS, type SwitchMeaning } from "../listCreation/testIds.ts";

Then("I expect clipboard to contain items content", async function (this: ComplexWorld) {
  // Use system-appropriate line separator for cross-platform compatibility
  const expectedText = ["first item", "second item", "third item"].map((item) => this.data[item] + EOL || "").join("");

  const clipboardContent = await this.page.evaluate(() => navigator.clipboard.readText());

  expect(clipboardContent).toEqual(expectedText);
});

When("I press the {string} switch", async function (this: ComplexWorld, switchMeaning: SwitchMeaning) {
  const switchElement = this.locateByIdParts(this.accounting.elements.registerTestId(SWITCH_TEST_IDS[switchMeaning]));

  await switchElement.click();
});

Then("I expect to see checkboxes for all list items", async function (this: ComplexWorld) {
  const itemInputs = this.locateByIdParts(LIST_ITEM);

  for (const itemInput of await itemInputs.all()) {
    const checkbox = itemInput.locator(buildTestableSelector(CHECKBOX));
    await expect(checkbox).toBeInViewport();
  }
});

Then("I expect not to see checkboxes for any list item", async function (this: ComplexWorld) {
  const itemInputs = this.locateByIdParts(LIST_ITEM);

  for (const itemInput of await itemInputs.all()) {
    const checkbox = itemInput.locator(buildTestableSelector(CHECKBOX));
    await expect(checkbox).not.toBeVisible();
  }
});

When("I check a random checkbox", async function (this: ComplexWorld) {
  const itemInputs = this.locateByIdParts(LIST_ITEM);
  const allItemInputs = await itemInputs.all();

  const randomIndex = Math.floor(Math.random() * allItemInputs.length);

  this.numbers.checkedCheckboxIndex = randomIndex;

  const checkbox = itemInputs.nth(randomIndex).locator(buildTestableSelector(CHECKBOX));
  await checkbox.click();
});

Then("I expect the checked checkbox to be checked", async function (this: ComplexWorld) {
  const itemInputs = this.locateByIdParts(LIST_ITEM);

  const checkedIndex = this.numbers.checkedCheckboxIndex;

  if (checkedIndex === undefined) {
    throw new Error("No checked checkbox index found");
  } else {
    const checkbox = itemInputs.nth(checkedIndex).locator(buildTestableSelector(CHECKBOX));
    await expect(checkbox).toBeChecked();
  }
});

Then("I expect other checkboxes not to be checked", async function (this: ComplexWorld) {
  const itemInputs = this.locateByIdParts(LIST_ITEM);
  const allItemInputs = await itemInputs.all();

  const checkedIndex = this.numbers.checkedCheckboxIndex;

  if (checkedIndex === undefined) {
    throw new Error("No checked checkbox index found");
  } else {
    for (let i = 0; i < allItemInputs.length; i++) {
      if (i !== checkedIndex) {
        const checkbox = itemInputs.nth(i).locator(buildTestableSelector(CHECKBOX));
        await expect(checkbox).not.toBeChecked();
      }
    }
  }
});

When("I uncheck the checked checkbox", async function (this: ComplexWorld) {
  const itemInputs = this.locateByIdParts(LIST_ITEM);

  const checkedIndex = this.numbers.checkedCheckboxIndex;

  if (checkedIndex === undefined) {
    throw new Error("No checked checkbox index found");
  } else {
    const checkbox = itemInputs.nth(checkedIndex).locator(buildTestableSelector(CHECKBOX));
    await checkbox.click();
  }
});

Then("I expect all checkboxes not to be checked", async function (this: ComplexWorld) {
  const itemInputs = this.locateByIdParts(LIST_ITEM);
  const allItemInputs = await itemInputs.all();

  for (const itemInput of allItemInputs) {
    const checkbox = itemInput.locator(buildTestableSelector(CHECKBOX));
    await expect(checkbox).not.toBeChecked();
  }
});

When("I ensure the presence of clipboard permissions", async function (this: ComplexWorld) {
  await this.context.grantPermissions(["clipboard-read", "clipboard-write"]);
});
