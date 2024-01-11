Feature: Adding items on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Adding single item input
    Then All elements expected to be on the List Creation page right after opening are here
    And I press the "add item" button
    Then I expect to see second item input ready for typing with the following placeholder: "Текст пункта"
    Then I expect to see no other elements

  Scenario: Adding items inputs more than fit into screen
    When I add items inputs till scroll appears plus one item input
    Then I expect to see the last added item input
    Then I expect not to see the first item input
    Then I expect to see list title input ready for typing with the following placeholder: "Название чек-листа"
    Then I expect to see the disabled "create" button with the following text: "Создать"
    Then I expect to see the "add item" button ready for clicking with the following text: "Добавить пункт"
    Then I expect to see the "import" button ready for clicking with the following text: "Импортировать"

  Scenario: Adding items inputs to the limit
    When I add items inputs to their limit
    Then I expect to see the warning about items inputs limit reached
    Then I expect to see the disabled "add item" button with the following text: "Добавить пункт"
    Then I expect to see the disabled "import" button with the following text: "Импортировать"
    Then I expect the "add item button" not to be focused

  Scenario: Adding item input with keyboard
    And I press "Tab" key
    And I press "Tab" key
    And I press "Tab" key
    Then I expect the "add item button" to be focused
    And I press "Space" key
    Then I expect to see second item input ready for typing with the following placeholder: "Текст пункта"
    Then I expect the "add item button" to be focused
    Then I expect to see the "add item" button ready for clicking with the following text: "Добавить пункт"
