Feature: Seeing the basis of Lists page

  Scenario: Seeing no lists on freshly opened Lists page
    When I clear all data
    When I open Lists page
    Then I expect to see the following suffixed tab title: "Мои списки"
    Then I expect to see sidebar
    Then I expect to see header
    Then I expect to see the following title: "Мои списки"
    Then I expect to see the message about lists absence
    Then I expect to see the "save" button enabled
    Then All necessary elements are on the "Lists" page
    Then I expect to see no other elements
