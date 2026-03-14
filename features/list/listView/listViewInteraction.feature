Feature: Interacting with the List view page

  Background:
    When I clear all data
    And I add a list

  Scenario: Copying items to clipboard
    And I ensure the tools panel is open
    And I type some text with length less or equal to the one of "first item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type some text with length less or equal to the one of "third item" input limit
    And I ensure the presence of clipboard permissions
    And I ensure the tools panel is open
    And I press the "copy items" button
    And I ensure the tools panel does not disturb
    And I expect clipboard to contain items content
