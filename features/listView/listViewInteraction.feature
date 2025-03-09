Feature: Interacting with the List view page

  Background:
    When I clear all data

  Scenario: Copying items to clipboard
    When I add a list
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "add item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "add item" button
    And I type some text with length less or equal to the one of "third item" input limit
    And I press the "copy items" button
    And I expect clipboard to contain items content

  Scenario: Displaying checkboxes when pressing the checklist switch
    When I add a list
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "add item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "checklist" switch
    Then I expect to see checkboxes for all list items
