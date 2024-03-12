Feature: Removing items on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Removing single item input
    And I press the "add item" button
    And I press the "remove second item" button
    And I wait for the deletion pawl countdown of 5 seconds to pass
    Then I expect to see the only one item input left on the page
