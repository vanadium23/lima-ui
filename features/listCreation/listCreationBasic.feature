Feature: Seeing the basis of List Creation page

  Background:
    When I open List Creation page

  Scenario: Opening List Creation page
    Then I expect to see sidebar
    Then I expect to see header with the following title: "Создание списка"
    Then I expect to see list title input ready for typing with the following placeholder: "Название чек-листа"
    Then I expect to see items inputs area without scroll
    Then I expect to see single item input ready for typing with the following placeholder: "Текст пункта"
    Then I expect to see the "create" button disabled with the following text: "Создать"
    Then I expect to see the "add item" button ready for clicking with the following text: "Добавить пункт"
    Then I expect to see the "import" button ready for clicking with the following text: "Импортировать"
    Then All elements expected to be on the List Creation page right after opening are here
    Then I expect to see no other elements
