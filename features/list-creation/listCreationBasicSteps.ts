import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import {
  buildTestSelector,
  TEST_ID_ATTRIBUTE,
} from "../utilities/buildTestSelector.ts";
import {
  ADD_ITEM_BUTTON,
  CREATE_LIST_BUTTON,
  IMPORT_BUTTON,
  ITEM_INPUT,
  LIST_TITLE_INPUT,
  PAGE_TITLE,
  SIDEBAR,
} from "../testIds.ts";
import type { AccountedTesting } from "../../cypress/support/e2e.ts";

When("I open list creation page", function () {
  cy.visit("create-checklist");
});

Then("I expect to see sidebar", function (this: AccountedTesting) {
  cy.get(buildTestSelector(this.registerTestId(SIDEBAR))).should("be.visible");
});

Then(
  "I expect to see header with the following title: {string}",
  function (this: AccountedTesting, pageTitleText: string) {
    cy.get(buildTestSelector(this.registerTestId(PAGE_TITLE)))
      .should("be.visible")
      .invoke("text")
      .invoke("trim")
      .should("equal", pageTitleText);
  },
);

Then(
  "I expect to see list title input ready for typing with the following placeholder: {string}",
  function (this: AccountedTesting, placeholder: string) {
    cy.get(buildTestSelector(this.registerTestId(LIST_TITLE_INPUT)))
      .should("be.visible")
      .should("be.enabled")
      .should("have.attr", "placeholder", placeholder);
  },
);

Then(
  "I expect to see single item input ready for typing with the following placeholder: {string}",
  function (this: AccountedTesting, placeholder: string) {
    cy.get(buildTestSelector(this.registerTestId(ITEM_INPUT)))
      .should("have.length", 1)
      .should("be.visible")
      .should("be.enabled")
      .should("have.attr", "placeholder", placeholder);
  },
);

Then(
  "I expect to see the disabled {string} button",
  function (this: AccountedTesting, buttonText: string) {
    cy.get(buildTestSelector(this.registerTestId(CREATE_LIST_BUTTON)))
      .should("be.visible")
      .should("be.disabled")
      .invoke("text")
      .should("equal", buttonText);
  },
);

const BUTTON_TEST_IDS = {
  "Добавить пункт": ADD_ITEM_BUTTON,
  Импортировать: IMPORT_BUTTON,
};
Then(
  "I expect to see the {string} button ready for clicking",
  function (this: AccountedTesting, buttonText: keyof typeof BUTTON_TEST_IDS) {
    const buttonTestId = BUTTON_TEST_IDS[buttonText];

    cy.get(buildTestSelector(this.registerTestId(buttonTestId)))
      .should("be.visible")
      .should("be.enabled")
      .invoke("text")
      .should("equal", buttonText);
  },
);

Then("I expect to see no other elements", function (this: AccountedTesting) {
  cy.get(buildTestSelector())
    .then(($elements) => {
      return Cypress.$.makeArray($elements)
        .map((element) => element.getAttribute(TEST_ID_ATTRIBUTE))
        .sort();
    })
    .should("deep.equal", this.getTestIds());
});
