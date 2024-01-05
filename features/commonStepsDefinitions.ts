import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import type { AccountedTesting } from "../cypress/support/e2e.ts";
import {
  buildTestSelector,
  extractCompleteId,
} from "./utilities/buildTestSelector.ts";
import {
  ADD_ITEM_BUTTON,
  BUTTON_TEST_IDS,
  type ButtonTestId,
  CREATE_LIST_BUTTON,
  IMPORT_BUTTON,
  ITEM_INPUT,
  ITEMS_INPUTS,
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
      ITEMS_INPUTS,
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

Then(
  "I expect to see list title input ready for typing with the following placeholder: {string}",
  function (this: AccountedTesting, placeholder: string) {
    cy.get(buildTestSelector(this.registerTestId(LIST_TITLE_INPUT)))
      .should("be.visible")
      .and("be.enabled")
      .and("have.attr", "placeholder", placeholder);
  },
);

Then(
  "I expect to see the disabled {string} button with the following text: {string}",
  function (
    this: AccountedTesting,
    buttonMeaning: ButtonTestId,
    buttonText: string,
  ) {
    const buttonTestId = BUTTON_TEST_IDS[buttonMeaning];

    cy.get(buildTestSelector(this.registerTestId(buttonTestId)))
      .should("be.visible")
      .and("be.disabled")
      .invoke("text")
      .should("equal", buttonText);
  },
);
Then(
  "I expect to see the {string} button ready for clicking with the following text: {string}",
  function (
    this: AccountedTesting,
    buttonMeaning: ButtonTestId,
    buttonText: string,
  ) {
    const buttonTestId = BUTTON_TEST_IDS[buttonMeaning];

    cy.get(buildTestSelector(this.registerTestId(buttonTestId)))
      .should("be.visible")
      .and("be.enabled")
      .invoke("text")
      .should("equal", buttonText);
  },
);
