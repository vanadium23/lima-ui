import { Then } from "@badeball/cypress-cucumber-preprocessor";
import {
  buildTestSelector,
  TEST_SUB_ID_ATTRIBUTE,
} from "../utilities/buildTestSelector.ts";
import { ITEM_INPUT, ITEMS_INPUTS, PAGE_TITLE, SIDEBAR } from "../testIds.ts";
import type { AccountedTesting } from "../../cypress/support/e2e.ts";
import { noVerticalScroll } from "../utilities/checkScroll.ts";

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
  "I expect to see items inputs area without scroll",
  function (this: AccountedTesting) {
    cy.get(buildTestSelector(this.registerTestId(ITEMS_INPUTS))).should(
      ($element) => {
        expect(noVerticalScroll($element.get(0))).to.be.true;
      },
    );
  },
);
