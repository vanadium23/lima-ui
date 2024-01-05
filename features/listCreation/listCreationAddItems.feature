Feature: Adding items on the List Creation page

  Background:
    When I open List Creation page
    Then All elements expected to be on the List Creation page right after opening are here

  Scenario: Adding single item input
    And I press the "add item" button
    Then I expect to see second item input ready for typing with the following placeholder: "Текст пункта"
    Then I expect to see no other elements

  Scenario: Adding items inputs more than fit into screen
    And I add items inputs till scroll appears plus one item input
    Then I expect to see the last added item input
    Then I expect not to see the first item input
    Then I expect to see list title input ready for typing with the following placeholder: "Название чек-листа"
    Then I expect to see the disabled "create" button with the following text: "Создать"
    Then I expect to see the "add item" button ready for clicking with the following text: "Добавить пункт"
    Then I expect to see the "import" button ready for clicking with the following text: "Импортировать"
