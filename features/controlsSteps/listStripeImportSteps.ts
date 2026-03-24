import { When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { LIST_STRIPE_IMPORT, LIST_STRIPE_IMPORT_HEADER } from "../testIds.ts";
import { buildFullTestId, buildTestableSelector } from "../utilities/buildTestableSelector.ts";

const LIST_STRIPE_IMPORT_IDS = {
  "first import list": buildFullTestId(LIST_STRIPE_IMPORT, 0),
};

type ListStripeForImportMeaning = keyof typeof LIST_STRIPE_IMPORT_IDS;

When(
  "I press the {string} list stripe for import",
  async function (this: ComplexWorld, listStripeForImportMeaning: ListStripeForImportMeaning) {
    const listStripeForImport = this.locateByFullId(LIST_STRIPE_IMPORT_IDS[listStripeForImportMeaning]);
    const header = listStripeForImport.locator(buildTestableSelector(LIST_STRIPE_IMPORT_HEADER));

    await header.click();
  },
);
