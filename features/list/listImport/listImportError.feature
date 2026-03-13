Feature: Importing elements error handling

  Background:
    And I clear all data
    When I add a list
    And I add a list

  Scenario: User opens import dialog but the request fails with an error
    Given Data server is not available
    When I hover "first list item"
    And I press the "open context menu first item" button
    And I press the visible "import item below" menu item
    Then I expect to see the "import" dialog modal box
    Then I expect not to see the "import" dialog modal box
    Then I expect to see the "single import" error
