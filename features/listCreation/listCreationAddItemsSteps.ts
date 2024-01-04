import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { BUTTON_TEST_IDS, type ButtonTestId, ITEM_INPUT } from "../testIds.ts";
import {
  buildTestSelector,
  TEST_SUB_ID_ATTRIBUTE,
} from "../utilities/buildTestSelector.ts";
import type { AccountedTesting } from "../../cypress/support/e2e.ts";

Then("I press the {string} button", function (buttonMeaning: ButtonTestId) {
  const buttonTestId = BUTTON_TEST_IDS[buttonMeaning];

  cy.get(buildTestSelector(buttonTestId)).click();
});

Then(
  "I expect to see second item input ready for typing with the following placeholder: {string}",
  function (this: AccountedTesting, placeholder: string) {
    cy.get(buildTestSelector(ITEM_INPUT))
      .eq(1)
      .each((input) =>
        this.registerTestIdAndSubId(
          ITEM_INPUT,
          input.attr(TEST_SUB_ID_ATTRIBUTE),
        ),
      )
      .should("be.visible")
      .should("be.enabled")
      .should("have.attr", "placeholder", placeholder);
  },
);
