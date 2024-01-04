Feature: Adding items on the List Creation page

  Background:
    When I open List Creation page
    Then All elements expected to be on the List Creation page right after opening are here

  Scenario: Adding single item
    And I press the "add item" button
    Then I expect to see second item input ready for typing with the following placeholder: "Текст пункта"
    Then I expect to see no other elements
