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
