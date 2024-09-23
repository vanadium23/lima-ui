Feature: Seeing the basis of Lists page

  Scenario: Seeing no lists on freshly opened Lists page
    When I clear all data
    When I open Lists page
    Then I expect to see sidebar
    Then I expect to see header with the following title: "Мои списки"
    Then I expect to see the "create" button ready for clicking
    Then All elements expected to be on the Lists page right after opening are here
    Then I expect to see no other elements
