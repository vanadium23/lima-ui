Feature: Removing items on the List Creation page

  Background:
    When I open List Creation page

  @needs-fixing
  Scenario: Removing single item input
    And I press the "add item" button
    And I hover "second item container" and press the "remove second item" button
    And I hover "list title" input
    Then I expect to see the only one item input left on the page

  @needs-fixing
  Scenario: Seeing remove item button disabled for the only item input
    And I hover "first item container"
    Then I expect to see the "remove first item" button disabled

  @needs-fixing
  Scenario: Adding items inputs to the limit and then deleting one item input leads to warning disappear and buttons enablement
    When I add items inputs to their limit
    And I hover "on limit item container" and press the "remove on limit item" button
    Then I expect not to see the warning about items inputs limit reached
    Then I expect to see the "add item" button "enabled" with the following text: "Добавить пункт"
