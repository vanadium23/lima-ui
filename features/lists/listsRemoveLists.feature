Feature: Removing the lists on the Lists page

  Background:
    When I clear all data

  Scenario: Seeing a dialog modal box on pressing the remove button
    When I add a list
    And I add a list
    And I hover away from anything actionable
    And I open Lists page
    And I hover "first" list stripe
    And I press the visible "remove list" button
    Then I expect to see the "remove list" dialog modal box
