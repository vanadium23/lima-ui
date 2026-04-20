Feature: Disabling controls when list is being updated

  Background:
    When I clear all data
    And I add a list
    And I refresh the page

  Scenario: Disabling form controls when pressing the "Save" button for list update
    When I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I press on the "list note" accordion
    And I type some text with length less or equal to the one of "list note" text area limit
    And I press the "save" button
    Then I expect to see the previous suffixed list title as tab title
    Then I expect to see sidebar or its button
    Then I expect to see header
    Then I expect to see search
    Then I expect to see tools panel or its button
    Then I expect to see the "list title" input disabled
    Then I expect to see the "list purpose" input disabled
    Then I expect to see the "list note" accordion disabled
    Then I expect to see the "list note" accordion content expanded
    Then I expect to see the "list note" text area disabled
    Then I expect to see list items area
    Then I expect to see the "first" item input disabled
    Then I expect to have the "automatic" item input disabled
    Then I expect to see the "save" button in the loading state
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button disabled
    Then I expect to see the "copy items" button disabled
    Then I expect to see the "remove list tools panel" button disabled
    Then I expect to see the "tools panel import" button disabled
    Then I expect to see the "print list" button disabled
    And I ensure the tools panel does not disturb
    Then All necessary elements are on the "List Creation Item Added, Note Expanded" page
    Then I expect to see no other elements

  Scenario: All items inputs are disabled on list update
    And I ensure the tools panel is open
    And I add list items till scroll appears plus one item input
    And I ensure the tools panel does not disturb
    And I type some text to all items inputs
    And I press the "save" button
    Then I expect all items inputs disabled

  Scenario: "Save" button triggers list update only once
    When I type some text with length less or equal to the one of "list title" input limit
    And I start counting the "list update" requests
    And I press the "save" button
    And I forcefully press the "save" button
    And I forcefully press the "save" button
    And I forcefully press the "save" button
    And I wait for "all requests to happen" for the following number of seconds: 1
    Then I expect to see the following number of "list update" request: 1
