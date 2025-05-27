Feature: Seeing the basis of the automatically added item

  Background:
    When I open List Creation page

  Scenario: Seeing the new item automatically added
    And I type some text with length less or equal to the one of "first item" input limit
    Then I expect to see the "automatic" item input enabled

  Scenario: Not seeing the automatically added item when the first item is removed
    And I type some text with length less or equal to the one of "first item" input limit
    And I hover "first list item"
    And I press the "open context menu first item" button
    And I press the "remove first list item" menu item
    Then I expect not to see the "automatic" item input

  Scenario: Seeing the automatically added item removed when the previous is cleared
    And I type some text with length less or equal to the one of "first item" input limit
    Then I expect to see the "automatic" item input enabled
    And I clear the "first item" input
    Then I expect not to see the "automatic" item input

  Scenario: Reaching limit via the automatically added item
    And I add list items to their limit via automatically added item
    Then I expect to see the warning about items inputs limit reached
    Then I expect to see the "add list item" button "disabled" with the following text: "Добавить пункт"
    Then I expect not to see the "automatic" item input
    And I focus some list item input
    And I press the visible "open context menu list item" button
    Then I expect to see the "add item above" menu item disabled
    Then I expect to see the "add item below" menu item disabled
    Then I reviewed all item addition method of the list page

  Scenario: Restoring automatically added item after its removal
    And I type some text with length less or equal to the one of "first item" input limit
    And I hover "automatic list item"
    And I press the "open context menu second item" button
    And I press the "remove second list item" menu item
    Then I expect not to see the "automatic" item input
    And I type some text with length less or equal to the one of "first item" input limit
    Then I expect to see the "automatic" item input enabled

  Scenario: Automatically added item is not restored when modifying the not last list item
    And I type some text with length less or equal to the one of "first item" input limit
    And I type some text with length less or equal to the one of "automatic item" input limit
    And I hover "automatic list item"
    And I press the "open context menu third item" button
    And I press the "remove third list item" menu item
    And I type some text with length less or equal to the one of "first item" input limit
    Then I expect not to see the "automatic" item input
