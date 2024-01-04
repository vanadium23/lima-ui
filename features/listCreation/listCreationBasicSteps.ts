import { Then } from "@badeball/cypress-cucumber-preprocessor";
import {
  buildTestSelector,
  TEST_SUB_ID_ATTRIBUTE,
} from "../utilities/buildTestSelector.ts";
import {
  BUTTON_TEST_IDS,
  type ButtonTestId,
  ITEM_INPUT,
  LIST_TITLE_INPUT,
  PAGE_TITLE,
  SIDEBAR,
} from "../testIds.ts";
import type { AccountedTesting } from "../../cypress/support/e2e.ts";

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
    cy.get(buildTestSelector(ITEM_INPUT))
      .each((input) =>
        this.registerTestIdAndSubId(
          ITEM_INPUT,
          input.attr(TEST_SUB_ID_ATTRIBUTE),
        ),
      )
      .should("have.length", 1)
      .should("be.visible")
      .should("be.enabled")
      .should("have.attr", "placeholder", placeholder);
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
      .should("be.disabled")
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
      .should("be.enabled")
      .invoke("text")
      .should("equal", buttonText);
  },
);
