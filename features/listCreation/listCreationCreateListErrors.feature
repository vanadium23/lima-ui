Feature: Failing to create a new list

  Background:
    When I open List Creation page

  Scenario: Seeing connection error when the browser is offline
    Given There is no internet connection
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "create" button
    Then I expect to see the connection error

  Scenario: Seeing connection error when the server is not available
    Given Data server is not available
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "create" button
    Then I expect to see the connection error

  Scenario: Connection error is hidden for the new "Create" button pressing
    Given There is no internet connection
    And I type some text with length less or equal to the one of "list title" input limit
    And I type some text with length less or equal to the one of "list purpose" input limit
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "create" button
    And I press the "create" button
    Then I not expect to see the connection error
