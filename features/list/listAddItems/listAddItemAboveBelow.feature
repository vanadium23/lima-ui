Feature: Adding items above and below on the List page

  Background:
    When I open "List Creation" page

  Scenario: Adding an item above the first one via context menu
    When I hover "first list item"
    And I press the "open context menu first item" button
    Then I expect to see the fully visible "list item" context menu
    And I press the visible "add item above" menu item
    Then I expect to see the "first" item input enabled
    Then I expect to see the "second" item input enabled

  Scenario: Adding an item below the last added one via context menu
    When I ensure the tools panel is open
    And I add list items till scroll appears plus one item input
    And I ensure the tools panel does not disturb
    And I focus "last item" input
    And I open the corresponding list item context menu
    Then I expect to see the fully visible "list item" context menu
    And I press the visible "add item below" menu item
    Then I expect to see the new last item

  @heavy
  Scenario: Reaching the limit of list items via adding items above and below
    When I add list items to their limit via adding above and below
    Then I expect to see the warning about items inputs limit reached
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button disabled
    And I ensure the tools panel does not disturb
    Then I expect not to see the "automatic" item input
    And I focus "some item" input
    And I open the corresponding list item context menu
    Then I expect to see the "add item above" menu item disabled
    Then I expect to see the "add item below" menu item disabled
    Then I reviewed all item addition method of the list page
