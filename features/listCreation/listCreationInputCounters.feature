Feature: Seeing the amount of symbols left for typing in the inputs on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Seeing the list title input counter when focusing this input
    And I focus "list title" input
    Then I expect to see the "list title" counter
