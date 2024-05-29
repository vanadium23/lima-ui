Feature: Note on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Expanding Note accordion and seeing Note text area
    And I press on the "note" accordion
    Then I expect to see the "note" text area ready for typing

  Scenario: Expanding and collapsing Note accordion and not seeing Note text area
    And I press on the "note" accordion
    And I press on the "note" accordion
    Then I expect not to see the "note" text area

  Scenario: Text inside text area remains despite expanding and collapsing it
    And I press on the "note" accordion
    And I type some text with length less or equal to the one of "note" text area limit
    And I remember the text typed in the "note" text area
    And I press on the "note" accordion
    And I press on the "note" accordion
    Then I expect to see the remembered text in the "note" text area
