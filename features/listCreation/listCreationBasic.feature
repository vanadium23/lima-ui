Feature: Seeing the basis of List Creation page

  Background:
    When I open List Creation page

  Scenario: Opening List Creation page
    Then I expect to see sidebar
    Then I expect to see header with the following title: "Создание списка"
    Then I expect to see "list title" input ready for typing with the following placeholder: "Название списка"
    Then I expect to see "list purpose" input ready for typing with the following placeholder: "Назначение списка"
    Then I expect to see items inputs area without scroll
    Then I expect to see single item input ready for typing with the following placeholder: "Текст пункта"
    Then I expect to see the "create" button ready for clicking
    Then I expect to see the "add item" button ready for clicking
    Then I expect to see the "import" button ready for clicking
    Then I expect to fully see the collapsed "note" accordion ready for expanding
    Then All elements expected to be on the "List Creation" page
    Then I expect to see no other elements
