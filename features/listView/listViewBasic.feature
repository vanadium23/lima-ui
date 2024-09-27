Feature: Seeing the basis of List view page

  Scenario: Seeing list on List view page
    When I clear all data
    When I add a list
    Then I expect to see list title
