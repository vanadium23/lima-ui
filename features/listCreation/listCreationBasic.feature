Feature: Seeing the basis of list creation page

  Scenario: Opening list creation page
    When I open list creation page
    Then I expect to see sidebar
    Then I expect to see header with the following title: "Создание списка"
    Then I expect to see list title input ready for typing with the following placeholder: "Название чек-листа"
    Then I expect to see single item input ready for typing with the following placeholder: "Текст пункта"
    Then I expect to see the disabled "create" button with the following text: "Создать"
    Then I expect to see the "add item" button ready for clicking with the following text: "Добавить пункт"
    Then I expect to see the "import" button ready for clicking with the following text: "Импортировать"
    Then I expect to see no other elements
