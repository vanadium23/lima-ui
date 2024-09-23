Feature: Seeing the added lists on the Lists page

  Background:
    When I clear all data

  Scenario: Seeing list on Lists page
    When I add a list
    When I open Lists page
    Then I expect to see sidebar
    Then I expect to see header with the following title: "Мои списки"
    Then I expect to see created list
    Then I expect to see the "create" button ready for clicking
#    Then All elements expected to be on the Lists page right after opening are here
    Then I expect to see no other elements
