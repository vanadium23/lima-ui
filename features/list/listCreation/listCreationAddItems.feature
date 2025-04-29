Feature: Adding items on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Adding single item input
    Then All necessary elements are on the "List Creation" page
    And I press the "add list item" button
    And I hover "list title" input
    Then I expect to see the "automatic" item input enabled
    Then I expect to see no other elements

  Scenario: Adding items inputs more than fit into screen
    When I add list items till scroll appears plus one item input
    Then I expect to see the last added item input
    Then I expect not to see the first item input
    Then I expect to see the "list title" input enabled
    Then I expect to see the "list purpose" input enabled
    Then I expect to see the "save" button enabled
    Then I expect to see the "add list item" button enabled

  Scenario: Adding items inputs to the limit
    When I add list items to their limit
    And I type some text with length less or equal to the one of "automatic item" input limit
    Then I expect to see the warning about items inputs limit reached
    Then I expect to see the "add list item" button "disabled" with the following text: "Добавить пункт"
    Then I expect not to see the "automatic" item input
    And I focus some list item input
    And I press the visible "open context menu list item" button
    Then I expect to see the "add item above" menu item disabled
    Then I expect to see the "add item below" menu item disabled
    Then I reviewed all item addition method of the list page

