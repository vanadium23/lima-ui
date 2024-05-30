Feature: Note on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Expanding Note accordion and seeing Note text area
    When I press on the "note" accordion
    Then I expect to see the "note" text area ready for typing

  Scenario: Expanding and collapsing Note accordion and not seeing Note text area
    When I press on the "note" accordion
    And I press on the "note" accordion
    Then I expect not to see the "note" text area

  Scenario: Text inside text area remains despite expanding and collapsing it
    When I press on the "note" accordion
    And I type some text with length less or equal to the one of "note" text area limit
    And I remember the text typed in the "note" text area
    And I press on the "note" accordion
    And I press on the "note" accordion
    Then I expect to see the remembered text in the "note" text area

  Scenario: Fully seeing the collapsed note accordion when there are more inputs than fit into screen
    When I add items inputs till scroll appears plus one item input
    Then I expect to fully see the collapsed "note" accordion ready for expanding

  Scenario: Fully seeing the expanded note accordion when there are more inputs than fit into screen
    When I add items inputs till scroll appears plus one item input
    And I press on the "note" accordion
    Then I expect to fully see the expanded "note" accordion ready for collapsing

  Scenario: Seeing the note counter when focusing its text area
    When I press on the "note" accordion
    And I focus "note" text area
    Then I expect to see the "note text area" counter
    Then I expect "note text area" counter to show the correct limit

  Scenario: Seeing the correct counter remainder with some text in the note text area
    When I press on the "note" accordion
    And I focus "note" text area
    And I type some text with length less or equal to the one of "note" text area limit
    Then I expect "note text area" counter to show the correct remaining value

  Scenario: Not being able to type more text than in note's text area limit
    When I press on the "note" accordion
    And I focus "note" text area
    And I type some text with length more than of "note" text area limit
    Then I expect "note text area" counter to show 0
    Then I expect "note" text area content length to be equal to its limit
