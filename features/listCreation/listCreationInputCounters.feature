Feature: Seeing the amount of symbols left for typing in the inputs on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Seeing the list title input counter when focusing this input
    And I focus "list title" input
    Then I expect to see the "list title input" counter
    Then I expect "list title input" counter to show the correct limit

  Scenario: Seeing the item input counter when focusing this input
    And I focus "first item" input
    Then I expect to see the "first item input" counter
    Then I expect "first item input" counter to show the correct limit

  Scenario: Seeing the correct counter remainder with some text in the list title input
    And I focus "list title" input
    And I type some text with length less or equal to the one of "list title" input limit
    Then I expect "list title input" counter to show the correct remaining value

  Scenario: Seeing the correct counter remainder with some text in the item input
    And I focus "first item" input
    And I type some text with length less or equal to the one of "first item" input limit
    Then I expect "first item input" counter to show the correct remaining value
