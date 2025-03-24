Feature: Basic list printing functionality

  Background:
    When I open List Creation page

  Scenario: Print button enables after creating a list
    When I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "create" button
    And I wait for the list to create
    Then I expect to see the "print list" button enabled

  Scenario: List data is visible on the print page
    When I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I press on the "list note" accordion
    And I type some text with length less or equal to the one of "list note" text area limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "third item" input limit
    And I press the "create" button
    And I wait for the list to create
    And I press the print list button and wait for the new tab
    Then I expect to see the "list title" text
    Then I expect to see the "list purpose" text
    Then I expect to see the "list note" text
    Then I expect to see the "first item" text
    Then I expect to see the "second item" text
    Then I expect to see the "third item" text

  Scenario: List purpose is not visible on the print page when not provided
    When I type some text with length less or equal to the one of "list title" input limit
    And I press on the "list note" accordion
    And I type some text with length less or equal to the one of "list note" text area limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "create" button
    And I wait for the list to create
    And I press the print list button and wait for the new tab
    Then I expect to see the "list title" text
    Then I expect not to see the "list purpose" text
    Then I expect to see the "list note" text
    Then I expect to see the "first item" text

  Scenario: List note is not visible on the print page when not provided
    When I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "create" button
    And I wait for the list to create
    And I press the print list button and wait for the new tab
    Then I expect to see the "list title" text
    Then I expect to see the "list purpose" text
    Then I expect not to see the "list note" text
    Then I expect to see the "first item" text

  Scenario: Both list purpose and list note are not visible on the print page when not provided
    When I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "create" button
    And I wait for the list to create
    And I press the print list button and wait for the new tab
    Then I expect to see the "list title" text
    Then I expect not to see the "list purpose" text
    Then I expect not to see the "list note" text
    Then I expect to see the "first item" text
