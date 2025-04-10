Feature: Controls state after list update

  Background:
    When I clear all data
    And I add a list
    And I refresh the page

  Scenario: All controls are enabled after successful list update
    When I type some text with length less or equal to the one of "list title" input limit
    And I press on the "list note" accordion
    And I type some text with length less or equal to the one of "list note" text area limit
    And I press the "save" button
    And I wait for the list update to complete
    Then I expect to see sidebar
    Then I expect to see header
    Then I expect to see tools panel
    Then I expect to see the "list title" input enabled
    Then I expect to see the "list purpose" input enabled
    Then I expect to fully see the expanded "list note" accordion ready for collapsing
    Then I expect to see the "list note" text area enabled
    Then I expect to see items inputs area without scroll
    Then I expect to see the "first" item input enabled
    Then I expect to see the "second" item input enabled
    Then I expect to see the "save" button disabled
    Then I expect to see the "add list item" button enabled
    Then I expect to see the "copy items" button enabled
    Then I expect to see the "remove list tools panel" button enabled
    Then I expect to see the "checklist" switch enabled
    Then I expect to see the "print list" button enabled
    Then All elements expected to be on the "List Creation Item Added, Note Expanded" page
    Then I expect to see no other elements
