Feature: Successfully creating list with correct data

  Background:
    When I open List Creation page
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I press on the "list note" accordion
    And I type some text with length less or equal to the one of "list note" text area limit

  Scenario: Disabling form controls when pressing the "Create" button
    When I type some text with length less or equal to the one of "first item" input limit
    And I press the "create" button
    Then I expect to see sidebar
    Then I expect to see header
    Then I expect to see tools panel
    Then I expect to see the "list title" input disabled
    Then I expect to see the "list purpose" input disabled
    Then I expect to see the "list note" accordion disabled
    Then I expect to see the "list note" accordion content expanded
    Then I expect to see the "list note" text area disabled
    Then I expect to see items inputs area without scroll
    Then I expect to see the "first" item input disabled
    Then I expect to see the "second" item input disabled
    Then I expect to see the "add item" button disabled
    Then I expect to see the "create" button in the loading state
    Then I expect to see the "copy items" button disabled
    Then I expect to see the "remove list tools panel" button disabled
    Then I expect to see the "checklist" switch disabled
    Then I expect to see the "print list" button disabled
    Then All elements expected to be on the "List Creation Item Added, Note Expanded" page
    Then I expect to see no other elements

  Scenario: All items inputs are disabled on list creation
    When I add items inputs till scroll appears plus one item input
    And I type some text to all items inputs
    And I press the "create" button
    Then I expect all items inputs disabled

  Scenario: "Create" button triggers list creation only once
    When I type some text with length less or equal to the one of "first item" input limit
    And I start counting the "list creation" requests
    And I press the "create" button
    And I forcefully press the "create" button
    And I forcefully press the "create" button
    And I forcefully press the "create" button
    And I wait for "all requests to happen" for the following number of seconds: 1
    Then I expect to see the following number of "list creation" request: 1

  Scenario: Created list contains all data provided during creation
    When I type some text with length less or equal to the one of "first item" input limit
    And I press the "add item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "create" button
    And I wait for the list to create
    Then I expect to see "list title" input with the text I provided
    Then I expect to see "list purpose" input with the text I provided
    Then I expect to see "first item" input with the text I provided
    Then I expect to see "second item" input with the text I provided
    Then I press on the "list note" accordion
    Then I expect to see "list note" text area with the text I provided

  Scenario: Created list data persists after page refresh
    When I type some text with length less or equal to the one of "first item" input limit
    And I press the "add item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "create" button
    And I wait for the list to create
    And I refresh the page
    And I wait for the page to load
    Then I expect to see "list title" input with the text I provided
    Then I expect to see "list purpose" input with the text I provided
    Then I expect to see "first item" input with the text I provided
    Then I expect to see "second item" input with the text I provided
    Then I press on the "list note" accordion
    Then I expect to see "list note" text area with the text I provided
