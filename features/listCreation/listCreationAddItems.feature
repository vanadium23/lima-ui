Feature: Adding items on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Adding single item input
    Then All elements expected to be on the "List Creation" page
    And I press the "add item" button
    And I hover "list title" input
    Then I expect to see second item input ready for typing with the following placeholder: "Пункт списка"
    Then I expect to see no other elements

  Scenario: Adding items inputs more than fit into screen
    When I add items inputs till scroll appears plus one item input
    Then I expect to see the last added item input
    Then I expect not to see the first item input
    Then I expect to see "list title" input ready for typing with the following placeholder: "Название списка"
    Then I expect to see "list purpose" input ready for typing with the following placeholder: "Цель списка"
    Then I expect to see the "create" button ready for clicking
    Then I expect to see the "add item" button ready for clicking

  Scenario: Adding items inputs to the limit
    When I add items inputs to their limit
    Then I expect to see the warning about items inputs limit reached
    Then I expect to see the "add item" button "disabled" with the following text: "Добавить пункт"
