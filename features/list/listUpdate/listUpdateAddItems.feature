Feature: Adding items to an existing list

  Background:
    When I clear all data
    And I add a list
    And I refresh the page

  Scenario: Adding an item to an existing list
    When I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type some text with length less or equal to the one of "second item" input limit
    Then I expect to see the "save" button enabled
    And I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    Then I expect to see the "second item" input with the text I provided
    And I refresh the page
    And I wait for the page to load
    Then I expect to see the "second item" input with the text I provided

  Scenario: Adding multiple items to an existing list
    When I ensure the tools panel is open
    And I add list items till scroll appears plus one item input
    And I ensure the tools panel does not disturb
    And I fill empty items inputs with their index
    Then I expect to see the "save" button enabled
    And I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    And I expect the number of items to remain the same
    And I expect all items inputs to have the same text after saving
    And I refresh the page
    And I wait for the page to load
    Then I expect the number of items to remain the same
    And I expect all items inputs to have the same text after saving
