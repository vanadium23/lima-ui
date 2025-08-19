Feature: Navigating to some list page from Lists page

  Background:
    When I clear all data

  Scenario Outline: Navigating to some list page from Lists page
    When I add a list
    And I open <PageMeaning> page
    And I press on the "first" list stripe
    Then I expect to be on the "Some List" page

    Examples:
      | PageMeaning                   |
      | "My Lists"                    |
      | "My Lists without trailing /" |
