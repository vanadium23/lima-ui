Feature: Updating list

  Background:
    When I clear all data
    And I add a list
    And I refresh the page

  Scenario: Updating list title
    When I type some text with length less or equal to the one of "list title" input limit
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    Then I expect to see the "list title" input with the text I provided
    When I refresh the page
    And I wait for the page to load
    Then I expect to see the "list title" input with the text I provided

  Scenario: Updating list purpose
    When I type some text with length less or equal to the one of "list purpose" input limit
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    Then I expect to see the "list purpose" input with the text I provided
    When I refresh the page
    And I wait for the page to load
    Then I expect to see the "list purpose" input with the text I provided

  Scenario: Updating list note
    When I press on the "list note" accordion
    And I type some text with length less or equal to the one of "list note" text area limit
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    Then I expect to see the "list note" text area with the text I provided
    When I refresh the page
    And I wait for the page to load
    Then I press on the "list note" accordion
    And I expect to see the "list note" text area with the text I provided

  Scenario: Updating an existing list item
    When I type some text with length less or equal to the one of "first item" input limit
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    Then I expect to see the "first item" input with the text I provided
    When I refresh the page
    And I wait for the page to load
    Then I expect to see the "first item" input with the text I provided

  Scenario: Updating list items consequently
    When I type some text with length less or equal to the one of "first item" input limit
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type some text with length less or equal to the one of "second item" input limit
    When I press the "save" button
    And I wait for the list update to complete
    And I type some text with length less or equal to the one of "second item" input limit
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    Then I expect to see the "second item" input with the text I provided
    When I refresh the page
    And I wait for the page to load
    Then I expect to see the "second item" input with the text I provided

  Scenario: List is not duplicated after update without refresh
    Given I clear all data
    And I add a list
    When I type some text with length less or equal to the one of "list title" input limit
    When I press the "save" button
    And I wait for the list update to complete
    And I open Lists page
    Then I expect to see the following number of list stripes: 1
