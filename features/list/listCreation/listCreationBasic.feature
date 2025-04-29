Feature: Seeing the basis of List Creation page

  Background:
    When I open List Creation page

  Scenario: Opening List Creation page
    Then I expect to see the following suffixed tab title: "Новый список"
    Then I expect to see sidebar
    Then I expect to see header
    Then I expect to see tools panel
    Then I expect to see the "list title" input enabled
    Then I expect to see the "list purpose" input enabled
    Then I expect to fully see the collapsed "list note" accordion ready for expanding
    Then I expect to see items inputs area without scroll
    Then I expect to see single item input enabled
    Then I expect to see the "save" button "disabled" with the following text: "Сохранить"
    Then I expect to see the "add list item" button enabled
    Then I expect to see the "copy items" button disabled
    Then I expect to see the "remove list tools panel" button disabled
    Then I expect to see the "checklist" switch enabled
    Then I expect to see the "print list" button disabled
    Then All necessary elements are on the "List Creation" page
    Then I expect to see no other elements
