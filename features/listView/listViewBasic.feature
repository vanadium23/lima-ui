Feature: Seeing the basis of List view page

  Scenario: Seeing list on List view page
    When I clear all data
    When I add a list
    Then I expect to see sidebar
    Then I expect to see header
    Then I expect to see tools panel
    Then I expect to see "list title" input enabled
    Then I expect to see "list purpose" input enabled
    Then I expect to fully see the collapsed "list note" accordion ready for expanding
    Then I expect to see items inputs area without scroll
    Then I expect to see 2 item inputs ready for typing
    Then I expect to see the "create" button "disabled" with the following text: "Сохранить"
    Then I expect to see the "add item" button enabled
    Then I expect to see the "copy items" button enabled
    Then I expect to see the "remove list tools panel" button enabled
    Then I expect to see the "checklist" switch enabled
    Then I expect to see the "print list" button enabled
    Then All elements expected to be on the "List View" page
    Then I expect to see no other elements
