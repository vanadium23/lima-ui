Feature: Importing items when user has no lists

  Background:
    And I clear all data
    When I open "List Creation" page

  @zero-lists
  Scenario Outline: User without lists opens import dialog and sees empty message
    And I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    When I hover "first list item"
    And I press the "open context menu first item" button
    And I press the visible "<import position>" menu item
    Then I expect to see the "import" dialog modal box
    Then I expect to see the "import" dialog loading
    Then I expect to see the "import" dialog empty message

    Examples:
      | import position   |
      | import item above |
      | import item below |
