Feature: Seeing the added lists on the Lists page

  Background:
    When I clear all data

  Scenario: Seeing a list on Lists page
    When I add a list
    Then I hover away from anything actionable
    When I open Lists page
    Then All elements expected to be on the "Lists despite lists number" page
    Then I expect to see created list
    Then I expect to see no other elements

  Scenario: Seeing several lists on Lists page
    When I add a list
    When I add a list
    When I add a list
    Then I hover away from anything actionable
    When I open Lists page
    Then All elements expected to be on the "Lists despite lists number" page
    Then I expect to see the following number of list stripes: 3
    Then I expect to see no other elements
