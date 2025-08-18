Feature: Seeing the basis of List Creation page

  Background:
    When I open "List Creation" page

  Scenario: Seeing List Creation page
    Then I expect to see the following suffixed tab title: "Новый список"
    Then I expect to see sidebar or its button
    Then I expect to see header
    Then I expect to see search
    Then I expect to see tools panel or its button
    Then I expect to see the "list title" input enabled
    Then I expect to see the "list purpose" input enabled
    Then I expect to fully see the collapsed "list note" accordion ready for expanding
    Then I expect to see list items area
    Then I expect to see the "single" item input enabled
    Then I expect to see the "save" button disabled
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button enabled
    Then I expect to see the "copy items" button disabled
    Then I expect to see the "remove list tools panel" button disabled
    Then I expect to see the "checklist" switch enabled
    Then I expect to see the "import" button enabled
    Then I expect to see the "print list" button disabled
    And I ensure the tools panel does not disturb
    Then All necessary elements are on the "List Creation" page
    Then I expect to see no other elements

  Scenario Outline: Restoring default List Creation page state
    And I type some text with length less or equal to the one of <input> input limit
    And I clear the <input> input
    Then I expect to see the "save" button disabled

    Examples:
      | input          |
      | "list title"   |
      | "list purpose" |
      | "first item"   |

  Scenario: Restoring default List Creation page state after list note change
    When I press on the "list note" accordion
    And I type some text with length less or equal to the one of "list note" text area limit
    And I clear the "list note" text area
    Then I expect to see the "save" button disabled
