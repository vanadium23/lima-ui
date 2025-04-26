Feature: Adding items above and below on the List page

  Background:
    When I open List Creation page

  Scenario: Adding an item above the first one via context menu
    And I hover "first list item"
    And I press the visible "open context menu list item" button
    Then I expect to see the fully visible "list item" context menu
    And I press the visible "add item above" menu item
    Then I expect to see the "first" item input enabled
    Then I expect to see the "automatic" item input enabled

  Scenario: Adding an item below the last added one via context menu
    When I add list items till scroll appears plus one item input
    And I hover the last added item input
    And I press the visible "open context menu list item" button
    Then I expect to see the fully visible "list item" context menu
    And I press the visible "add item below" menu item
    Then I expect to see the new last item
