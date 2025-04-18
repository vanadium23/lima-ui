Feature: Adding items to an existing list

  Background:
    When I clear all data
    And I add a list
    And I refresh the page

  Scenario: Adding an item to an existing list
    When I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    Then I expect to see the "second item" input with the text I provided
    When I refresh the page
    And I wait for the page to load
    Then I expect to see the "second item" input with the text I provided

  Scenario: Adding multiple items to an existing list
    When I add list items till scroll appears plus one item input
    And I fill empty items inputs with their index
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    And I expect the number of items to remain the same
    And I expect all items inputs to have the same text after saving
    When I refresh the page
    And I wait for the page to load
    Then I expect the number of items to remain the same
    And I expect all items inputs to have the same text after saving
