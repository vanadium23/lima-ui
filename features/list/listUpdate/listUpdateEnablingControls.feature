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
    Then I expect to see the suffixed list title as tab title
    Then I expect to see sidebar or its button
    Then I expect to see header
    Then I expect to see search
    Then I expect to see tools panel or its button
    Then I expect to see the "list title" input enabled
    Then I expect to see the "list purpose" input enabled
    Then I expect to fully see the expanded "list note" accordion ready for collapsing
    Then I expect to see the "list note" text area enabled
    Then I expect to see list items area
    Then I expect to see the "first" item input enabled
    Then I expect to have the "automatic" item input enabled
    Then I expect to see the "save" button disabled
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button enabled
    Then I expect to see the "copy items" button enabled
    Then I expect to see the "remove list tools panel" button enabled
    Then I expect to see the "tools panel import" button enabled
    Then I expect to see the "print list" button enabled
    And I ensure the tools panel does not disturb
    Then All necessary elements are on the "List Creation Item Added, Note Expanded" page
    Then I expect to see no other elements

  Scenario: All controls are enabled after connection error during list update
    Given There is no internet connection
    And I type some text with length less or equal to the one of "list title" input limit
    And I press on the "list note" accordion
    And I type some text with length less or equal to the one of "list note" text area limit
    And I press the "save" button
    And I wait for the page to load
    Then I expect to see the previous suffixed list title as tab title
    Then I expect to see sidebar or its button
    Then I expect to see header
    Then I expect to see search
    Then I expect to see tools panel or its button
    Then I expect to see the "list title" input enabled
    Then I expect to see the "list purpose" input enabled
    Then I expect to fully see the expanded "list note" accordion ready for collapsing
    Then I expect to see the "list note" text area enabled
    Then I expect to see list items area
    Then I expect to see the "first" item input enabled
    Then I expect to have the "automatic" item input enabled
    Then I expect to see the "save" button enabled
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button enabled
    Then I expect to see the "copy items" button enabled
    Then I expect to see the "remove list tools panel" button enabled
    Then I expect to see the "tools panel import" button enabled
    Then I expect to see the "print list" button enabled
    And I ensure the tools panel does not disturb
    Then I expect to see the "single connection" error
    Then All necessary elements are on the "List Creation Item Added, Note Expanded, Connection Error" page
    Then I expect to see no other elements
