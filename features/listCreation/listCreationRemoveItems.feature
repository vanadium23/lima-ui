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

  Scenario: Removing several items inputs
    And I press the "add item" button 3 times
    And I press the "remove first item" button
    And I press the "remove third item" button
    And I press the "remove forth item" button
    Then I expect to see the "first item" input disabled
    Then I expect to see the "third item" input disabled
    Then I expect to see the "forth item" input disabled
    And I wait for the removal pawl countdown of 5 seconds to pass
    Then I expect to see the only one item input left on the page

  Scenario: Canceling several items inputs removal
    And I press the "add item" button 2 times
    And I press the "remove second item" button
    And I press the "remove third item" button
    And I press the "cancel second item removal" button
    And I press the "cancel third item removal" button
    And I wait for the removal pawl countdown of 5 seconds to pass
    Then I expect to see 3 items inputs ready for typing

  Scenario: Seeing remove item button on item input hover
    And I press the "add item" button
    And I hover "first item" input
    Then I expect to see "remove first item" button
