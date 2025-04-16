Feature: Removing items from an existing list

  Background:
    When I clear all data
    And I add a list
    And I refresh the page

  Scenario: Removing an item from an existing list
    When I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "save" button
    And I wait for the list update to complete
    And I refresh the page
    And I hover "second list item"
    And I press the visible "open context menu list item" button
    And I press the visible "remove list item" menu item
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    And I expect not to see the "second item" input with the text I provided
    When I refresh the page
    And I wait for the page to load
    Then I expect not to see the "second item" input with the text I provided

  Scenario: Removing multiple items from an existing list
    When I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "third item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "forth item" input limit
    And I press the "save" button
    And I wait for the list update to complete
    And I refresh the page
    And I hover "forth list item"
    And I press the visible "open context menu list item" button
    And I press the visible "remove list item" menu item
    And I hover "third list item"
    And I press the visible "open context menu list item" button
    And I press the visible "remove list item" menu item
    And I hover "second list item"
    And I press the visible "open context menu list item" button
    And I press the visible "remove list item" menu item
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    And I expect not to see the "second item" input with the text I provided
    And I expect not to see the "third item" input with the text I provided
    And I expect not to see the "forth item" input with the text I provided
    When I refresh the page
    And I wait for the page to load
    Then I expect not to see the "second item" input with the text I provided
    And I expect not to see the "third item" input with the text I provided
    And I expect not to see the "forth item" input with the text I provided
