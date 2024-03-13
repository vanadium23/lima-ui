Feature: Removing items on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Removing single item input
    And I press the "add item" button
    And I press the "remove second item" button
    Then I expect to see the "second item" input disabled
    And I wait for the removal pawl countdown of 5 seconds to pass
    Then I expect to see the only one item input left on the page

  Scenario: Canceling single item input removal
    And I press the "add item" button
    And I press the "remove second item" button
    And I press the "cancel second item removal" button
    And I wait for the removal pawl countdown of 5 seconds to pass
    Then I expect to see second item input ready for typing with the following placeholder: "Текст пункта"
