Feature: Searching for lists

  Background:
    When I clear all data
    And I add a list

  Scenario Outline: Interacting with search bar
    When I open <PageMeaning> page
    And I ensure search is visible
    And I focus "search bar" input
    And I wait for "dialog to remain hidden" for the following number of seconds: 0.5
    Then I expect not to see the search "dialog"
    And I add the following text into the "search bar": "a"
    And I wait for "dialog to remain hidden" for the following number of seconds: 0.5
    Then I expect not to see the search "dialog"
    And I add the following text into the "search bar": "b"
    Then I expect to see the search "dialog loading"
    And I add the following text into the "search bar": "c"
    Then I expect to see the search "dialog loading"
    And I add the following text into the "search bar": "d"
    Then I expect to see the search "dialog loading"
    And I clear the "search bar" input
    And I wait for "dialog to remain hidden" for the following number of seconds: 0.5
    Then I expect not to see the search "dialog"

    Examples:
      | PageMeaning     |
      | "My Lists"      |
      | "List Creation" |
      | "Latest List"   |
