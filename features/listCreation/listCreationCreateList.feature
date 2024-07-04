Feature: Successfully creating list with correct data

  Background:
    When I open List Creation page
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I press on the "note" accordion
    And I type some text with length less or equal to the one of "note" text area limit

  Scenario: Disabling form controls when pressing the "Create" button
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "create" button
    Then I expect to see the "list title" input disabled
    Then I expect to see the "list purpose" input disabled
    Then I expect to see the "note" accordion disabled
    Then I expect to see the "note" text area disabled
    Then I expect to see the "first item" input disabled
    Then I expect to see the "add item" button disabled
    Then I expect to see the "import" button disabled
    Then I expect to see the "create" button in the loading state

  Scenario: All items inputs are disabled on list creation
    When I add items inputs till scroll appears plus one item input
    And I type some text to all items inputs
    And I press the "create" button
    Then I expect all items inputs disabled

  Scenario: Not seeing the remove item buttons
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "create" button
    And I hover "first item" input
    Then I expect not to see the "remove first item" button
