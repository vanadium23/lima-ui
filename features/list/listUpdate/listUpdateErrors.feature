Feature: Failing to update a list

  Background:
    When I clear all data
    And I add a list
    And I refresh the page

  Scenario: "Save" button stays disabled when only spaces was added to fields
    And I type the following text into the "list title" input: "test"
    And I type the following text into the "list purpose" input: "test"
    And I type the following text into the "first item" input: "test"
    And I press on the "list note" accordion
    And I type the following text into the "list note" text area: "test"
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    And I type the following text into the "list title" input: "test  "
    And I type the following text into the "list purpose" input: "test  "
    And I type the following text into the "first item" input: "test  "
    And I type the following text into the "list note" text area: "test  "
    Then I expect to see the "save" button disabled

  Scenario: Seeing connection error on list update when the browser is offline
    Given There is no internet connection
    And I type some text with length less or equal to the one of "list title" input limit
    And I press the "save" button
    Then I expect to see the "connection" error

  Scenario: Seeing connection error on list update when the server is not available
    Given Data server is not available
    And I type some text with length less or equal to the one of "list title" input limit
    And I press the "save" button
    Then I expect to see the "connection" error

  Scenario: Connection error is hidden for the new "Save" button pressing on list update
    Given There is no internet connection
    And I type some text with length less or equal to the one of "list title" input limit
    And I press the "save" button
    And I wait for the page to load
    And I press the "save" button
    Then I expect not to see the "connection" error

  Scenario: Sending is not allowed when list title is empty on list update
    When I clear the "list title" input
    And I start counting the "list update" requests
    And I press the "save" button
    Then I expect to be focused on the "list title" input
    Then I expect to see the following number of "list update" request: 0

  Scenario: Sending is not allowed when item is empty on list update
    When I clear the "first item" input
    And I start counting the "list update" requests
    And I press the "save" button
    Then I expect to be focused on the "first item" input
    Then I expect to see the following number of "list update" request: 0

  Scenario: Hidden empty item input is shown when attempting to update a list
    When I clear the "first item" input
    And I ensure the tools panel is open
    And I add list items till scroll appears plus one item input
    And I ensure the tools panel does not disturb
    And I start counting the "list update" requests
    And I press the "save" button
    Then I expect to be focused on the "first item" input
    Then I expect to see the following number of "list update" request: 0
