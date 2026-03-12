Feature: Importing items when user has only one list from list page

  Background:
    And I clear all data
    When I add a list

  Scenario Outline: User with one list opens import dialog via context menu and sees empty message
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

  Scenario: User with one list opens import dialog via tools panel button and sees empty message
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    Then I expect to see the "import" dialog loading
    Then I expect to see the "import" dialog empty message
