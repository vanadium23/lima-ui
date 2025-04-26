Feature: Seeing the added lists on the Lists page

  Background:
    When I clear all data

  Scenario: Seeing a list on Lists page
    When I add a list
    And I hover away from anything actionable
    And I open Lists page
    Then All elements expected to be on the "Lists despite lists number" page
    Then I expect to see created list
    Then I expect to see no other elements

  Scenario: Seeing several lists on Lists page
    When I add a list
    And I add a list
    And I add a list
    And I hover away from anything actionable
    And I open Lists page
    Then All elements expected to be on the "Lists despite lists number" page
    Then I expect to see the following number of list stripes: 3
    Then I expect to see no other elements

  Scenario: Adding lists to the limit
    When I add lists to their limit
    And I open Lists page
    Then I expect to see the "save" button "disabled" with the following text: "Создать"
    Then I expect to see the warning about lists limit reached

  Scenario: Lists page with lists loading error
    When I open Lists page with failed lists loading
    Then I expect to see the "connection" error
    Then I expect to see the "save" button "enabled" with the following text: "Создать"
