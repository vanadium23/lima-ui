Feature: Adding items above and below on the List page

  Background:
    When I open List Creation page

  Scenario: Adding an item above the first one via context menu
    And I hover "first list item"
    And I press the visible "open context menu list item" button
    Then I expect to see the fully visible "list item" context menu
    And I press the visible "add item above" menu item
    Then I expect to see the "first" item input enabled
    Then I expect to see the "second" item input enabled

  Scenario: Adding an item below the last added one via context menu
    When I add list items till scroll appears plus one item input
    And I hover the last added item input
    And I press the visible "open context menu list item" button
    Then I expect to see the fully visible "list item" context menu
    And I press the visible "add item below" menu item
    Then I expect to see the new last item

  Scenario: Reaching the limit of list items via adding items above and below
    And I add list items to their limit via adding above and below
    Then I expect to see the warning about items inputs limit reached
    Then I expect to see the "add list item" button "disabled" with the following text: "Добавить пункт"
    Then I expect not to see the "automatic" item input
    And I focus some list item input
    And I press the visible "open context menu list item" button
    Then I expect to see the "add item above" menu item disabled
    Then I expect to see the "add item below" menu item disabled
    Then I reviewed all item addition method of the list page
