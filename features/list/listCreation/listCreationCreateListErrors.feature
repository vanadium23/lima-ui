Feature: Failing to create a new list

  Background:
    When I open List Creation page

  Scenario: Seeing connection error when the browser is offline
    Given There is no internet connection
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "save" button
    Then I expect to see the "connection" error

  Scenario: Seeing connection error when the server is not available
    Given Data server is not available
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "save" button
    Then I expect to see the "connection" error

  Scenario: Connection error is hidden for the new "Save" button pressing
    Given There is no internet connection
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "save" button
    And I wait for the page to load
    And I press the "save" button
    Then I expect not to see the "connection" error

  Scenario: Sending is not allowed when list title is empty
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I start counting the "list creation" requests
    And I press the "save" button
    Then I expect to be focused on the "list title" input
    Then I expect to see the following number of "list creation" request: 0

  Scenario: Sending is not allowed when item is empty
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I start counting the "list creation" requests
    And I press the "save" button
    Then I expect to be focused on the "first item" input
    Then I expect to see the following number of "list creation" request: 0

  Scenario: Hidden empty item input is shown when attempting to create a new list
    When I add list items till scroll appears plus one item input
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I start counting the "list creation" requests
    And I press the "save" button
    Then I expect to be focused on the "first item" input
    Then I expect to see the following number of "list creation" request: 0

  Scenario: All controls are enabled after connection error during list creation
    Given There is no internet connection
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I press on the "list note" accordion
    And I type some text with length less or equal to the one of "list note" text area limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "save" button
    And I wait for the page to load
    Then I expect to see the following suffixed tab title: "Новый список"
    Then I expect to see sidebar
    Then I expect to see header
    Then I expect to see tools panel
    Then I expect to see the "list title" input enabled
    Then I expect to see the "list purpose" input enabled
    Then I expect to fully see the expanded "list note" accordion ready for collapsing
    Then I expect to see the "list note" text area enabled
    Then I expect to see items inputs area without scroll
    Then I expect to see the "first" item input enabled
    Then I expect to see the "automatic" item input enabled
    Then I expect to see the "save" button enabled
    Then I expect to see the "add list item" button enabled
    Then I expect to see the "copy items" button disabled
    Then I expect to see the "remove list tools panel" button disabled
    Then I expect to see the "checklist" switch enabled
    Then I expect to see the "print list" button disabled
    Then I expect to see the "connection" error
    Then All necessary elements are on the "List Creation Item Added, Note Expanded, Connection Error" page
    Then I expect to see no other elements

  Scenario: List creation with items at limit and connection error shows both problems
    Given There is no internet connection
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I add list items to their limit
    And I fill all items inputs with their index
    And I press the "save" button
    And I wait for the page to load
    Then I expect to see the warning about items inputs limit reached
    Then I expect to see the "connection" error
