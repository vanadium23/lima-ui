Feature: Seeing the added lists on the Lists page

  Background:
    When I clear all data

  Scenario: Seeing a list on Lists page
    When I add a list
    And I hover away from anything actionable
    And I open Lists page
    Then All necessary elements are on the "Lists Despite Lists Number" page
    Then I expect to see created list
    Then I expect to see no other elements

  Scenario: Seeing several lists on Lists page
    When I add a list
    And I add a list
    And I add a list
    And I hover away from anything actionable
    And I open Lists page
    Then All necessary elements are on the "Lists Despite Lists Number" page
    Then I expect to see the following number of list stripes: 3
    Then I expect to see no other elements

  Scenario: Adding lists to the limit
    When I add lists to their limit
    And I open Lists page
    Then I expect to see the "create" button "disabled" with the following text: "Создать"
    Then I expect to see the warning about lists limit reached

  Scenario: Lists page with lists loading error
    When I open Lists page with failed lists loading
    Then I expect to see the following suffixed tab title: "Мои списки"
    Then I expect to see sidebar or its button
    Then I expect to see header
    Then I expect to see search
    Then I expect to see the following title: "Мои списки"
    Then I expect to see the "connection" error
    Then All necessary elements are on the "Lists with Error" page
    Then I expect to see no other elements
