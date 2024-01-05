import { Then } from "@badeball/cypress-cucumber-preprocessor";
import {
  ADD_ITEM_BUTTON,
  BUTTON_TEST_IDS,
  type ButtonTestId,
  ITEM_INPUT,
  ITEMS_INPUTS,
} from "../testIds.ts";
import {
  buildTestSelector,
  TEST_SUB_ID_ATTRIBUTE,
} from "../utilities/buildTestSelector.ts";
import type { AccountedTesting } from "../../cypress/support/e2e.ts";
import { noVerticalScroll } from "../utilities/checkScroll.ts";

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

function addItemWhileNoVerticalScrollInItemsInputs(
  $addItemButton: Cypress.Chainable<JQuery<HTMLElement>>,
) {
  cy.get(buildTestSelector(ITEMS_INPUTS)).then(($itemsInputs) => {
    if (noVerticalScroll($itemsInputs.get(0))) {
      // It's complicated to extract boolean values from Cypress.Chainable to add them
      // to if expression, so it's a workaround. When adding items till scroll appears,
      // it's expected that items' limit is not reached.
      $addItemButton.should("be.enabled").click();
      addItemWhileNoVerticalScrollInItemsInputs($addItemButton);
    }
  });
}

Then("I add items inputs till scroll appears plus one item input", function () {
  const $addItemButton = cy.get(buildTestSelector(ADD_ITEM_BUTTON));

  addItemWhileNoVerticalScrollInItemsInputs($addItemButton);

  $addItemButton.click();
});

Then("I expect to see the last added item input", function () {
  cy.get(buildTestSelector(ITEM_INPUT)).last().should("be.visible");
});

Then("I expect not to see the first item input", function () {
  cy.get(buildTestSelector(ITEM_INPUT)).first().should("not.be.visible");
});
