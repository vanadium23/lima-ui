Feature: Importing items when user has only one list from list page

  Background:
    Given I clear all data
    When I add a list

  @zero-lists
  Scenario Outline: User with one list opens import dialog via context menu and sees empty message
    When I hover "first list item"
    And I press the "open context menu first item" button
    And I press the visible "<import position>" menu item
    Then I expect to see the "import" dialog modal box
    Then I expect to see the "import" dialog loading
    Then I expect to see the "import" dialog empty message

    Examples:
      | import position      |
      | import element above |
      | import element below |

  @zero-lists
  Scenario: User with one list opens import dialog via tools panel button and sees empty message
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    Then I expect to see the "import" dialog loading
    Then I expect to see the "import" dialog empty message
