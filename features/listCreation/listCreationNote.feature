Feature: Note on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Opening Note accordion and seeing Note text area
    And I press on the "note" accordion
    Then I expect to see the "note" text area ready for typing

  Scenario: Opening and closing Note accordion and not seeing Note text area
    And I press on the "note" accordion
    And I press on the "note" accordion
    Then I expect not to see the "note" text area
