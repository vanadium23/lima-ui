import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import type { AccountedTesting } from "../cypress/support/e2e.ts";
import {
  buildTestSelector,
  extractCompleteId,
} from "./utilities/buildTestSelector.ts";
import {
  ADD_ITEM_BUTTON,
  CREATE_LIST_BUTTON,
  IMPORT_BUTTON,
  ITEM_INPUT,
  LIST_TITLE_INPUT,
  PAGE_TITLE,
  SIDEBAR,
} from "./testIds.ts";

When("I open List Creation page", function () {
  cy.visit("create-checklist");
});

Then(
  "All elements expected to be on the List Creation page right after opening are here",
  function (this: AccountedTesting) {
    const ALL_ITEMS_OF_LIST_CREATION_PAGE_BASIS = [
      ADD_ITEM_BUTTON,
      CREATE_LIST_BUTTON,
      IMPORT_BUTTON,
      `${ITEM_INPUT}0`,
      LIST_TITLE_INPUT,
      PAGE_TITLE,
      SIDEBAR,
    ];
    const testIds = this.getTestIds();

    if (testIds.length) {
      expect(testIds).to.deep.equal(
        ALL_ITEMS_OF_LIST_CREATION_PAGE_BASIS.sort(),
      );
    } else {
      this.registerSeveralTestIds(ALL_ITEMS_OF_LIST_CREATION_PAGE_BASIS);
    }
  },
);

Then("I expect to see no other elements", function (this: AccountedTesting) {
  cy.get(buildTestSelector())
    .then(($elements) => {
      return Cypress.$.makeArray($elements)
        .map((element) => extractCompleteId(element))
        .sort();
    })
    .should("deep.equal", this.getTestIds());
});
