Feature: Interacting with the List view page

  Background:
    When I clear all data

  Scenario: Copying items to clipboard
    When I add a list
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "third item" input limit
    And I ensure the presence of clipboard permissions
    And I press the "copy items" button
    And I expect clipboard to contain items content

  Scenario: Displaying checkboxes when pressing the checklist switch
    When I add a list
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "checklist" switch
    Then I expect to see checkboxes for all list items

  Scenario: Hiding checkboxes when pressing the checklist switch again
    When I add a list
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "checklist" switch
    And I press the "checklist" switch
    Then I expect not to see checkboxes for any list item

  Scenario: Checking checkboxes when pressing them
    When I add a list
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "checklist" switch
    And I check a random checkbox
    Then I expect the checked checkbox to be checked
    And I expect other checkboxes not to be checked

  Scenario: Unchecking checkboxes when pressing them again
    When I add a list
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "checklist" switch
    And I check a random checkbox
    And I uncheck the checked checkbox
    Then I expect all checkboxes not to be checked
