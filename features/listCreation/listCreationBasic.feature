Feature: Seeing the basis of List Creation page

  Background:
    When I open List Creation page

  Scenario: Opening List Creation page
    Then I expect to see sidebar
    Then I expect to see header
    Then I expect to see tools panel
    Then I expect to see "list title" input ready for typing with the following placeholder: "Название списка"
    Then I expect to see "list purpose" input ready for typing with the following placeholder: "Цель списка"
    Then I expect to see items inputs area without scroll
    Then I expect to see single item input ready for typing with the following placeholder: "Пункт списка"
    Then I expect to see the "create" button "disabled" with the following text: "Сохранить"
    Then I expect to see the "add item" button ready for clicking
    Then I expect to see the "copy items" button disabled
    Then I expect to see the "remove list tools panel" button disabled
    Then I expect to see the "checklist" switch enabled
    Then I expect to see the "print list" button disabled
    Then I expect to fully see the collapsed "list note" accordion ready for expanding
    Then All elements expected to be on the "List Creation" page
    Then I expect to see no other elements
