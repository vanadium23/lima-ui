Feature: Removing items on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Removing single list item
    And I press the "add list item" button
    And I hover "second list item"
    And I press the "open dropdown menu second item" button
    And I press the "remove second list item" menuitem
    Then I expect to see the only one list item left on the page

  Scenario: Seeing remove item menu item disabled for the only one list item
    And I hover "first list item"
    And I press the "open dropdown menu first item" button
    Then I expect to see the "remove first list item" menu item disabled
    
  Scenario: Adding list item to the limit and then deleting one list item leads to limit error disappear and buttons enablement
    When I add list items to their limit
    And I hover "on the last list item of the limit"
    And I press the "open dropdown menu for last list item of the limit" button
    And I press the "remove on the last list item of the limit" menuitem
    Then I expect not to see the warning about items inputs limit reached
    Then I expect to see the "add list item" button "enabled" with the following text: "Добавить пункт"
