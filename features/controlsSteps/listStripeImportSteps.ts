import { When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { LIST_STRIPE_IMPORT, LIST_STRIPE_IMPORT_HEADER, LIST_STRIPE_IMPORT_ITEM_CHECKBOX } from "../testIds.ts";
import { buildTestableSelector } from "../utilities/buildTestableSelector.ts";

const LIST_STRIPE_IMPORT_POSITIONS = {
  "first import list": 0,
  "second import list": 1,
  "third import list": 2,
};

type ListStripeForImportMeaning = keyof typeof LIST_STRIPE_IMPORT_POSITIONS;

const IMPORT_ITEM_POSITIONS = {
  "first import item": 0,
  "second import item": 1,
  "third import item": 2,
};

type ImportItemMeaning = keyof typeof IMPORT_ITEM_POSITIONS;

function locateListStripeForImport(complexWorld: ComplexWorld, stripeMeaning: ListStripeForImportMeaning) {
  return complexWorld.locateByIdParts(LIST_STRIPE_IMPORT, LIST_STRIPE_IMPORT_POSITIONS[stripeMeaning]);
}

When(
  "I press the {string} list stripe for import",
  async function (this: ComplexWorld, stripeMeaning: ListStripeForImportMeaning) {
    const header = locateListStripeForImport(this, stripeMeaning).locator(
      buildTestableSelector(LIST_STRIPE_IMPORT_HEADER),
    );

    await header.click();
  },
);

When(
  "I check the {string} checkbox in the {string}",
  async function (this: ComplexWorld, itemMeaning: ImportItemMeaning, stripeMeaning: ListStripeForImportMeaning) {
    const checkbox = locateListStripeForImport(this, stripeMeaning)
      .locator(buildTestableSelector(LIST_STRIPE_IMPORT_ITEM_CHECKBOX))
      .nth(IMPORT_ITEM_POSITIONS[itemMeaning]);

    const checkboxInput = checkbox.locator("input");

    if (!(await checkboxInput.isChecked())) {
      await checkbox.click();
    }
  },
);
