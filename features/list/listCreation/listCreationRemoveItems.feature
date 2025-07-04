Feature: Removing items on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Removing single list item
    When I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I hover "second list item"
    And I press the "open context menu second item" button
    And I press the visible "remove list item" menu item
    Then I expect to see the only one list item left on the page

  Scenario: Seeing remove item menu item disabled for the only one list item
    When I hover "first list item"
    And I press the "open context menu first item" button
    Then I expect to see the "remove first list item" menu item disabled

  Scenario: Adding list item to the limit and then removing one list item leads to limit warning disappear and buttons enablement
    When I ensure the tools panel is open
    And I add list items to their limit
    And I ensure the tools panel does not disturb
    And I hover "on the last list item of the limit"
    And I press the "open context menu for last list item of the limit" button
    And I press the visible "remove list item" menu item
    Then I expect not to see the warning about items inputs limit reached
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button enabled
    And I ensure the tools panel does not disturb
