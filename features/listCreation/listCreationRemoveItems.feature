Feature: Removing items on the List Creation page

  Background:
    When I open List Creation page

  Scenario: Removing single item input
    And I press the "add item" button
    And I hover "second item container" and press the "remove second item" button
    Then I expect to see the "second item" input disabled
    And I hover "list title" input
    Then I expect to see the following number of "cancel item removal" buttons on the page: 1
    And I wait for "the removal pawl countdown to pass" for the following number of seconds: 5
    Then I expect to see the only one item input left on the page

  Scenario: Canceling single item input removal
    And I press the "add item" button
    And I hover "second item container" and press the "remove second item" button
    And I press the "cancel second item removal" button
    And I wait for "the removal pawl countdown to pass" for the following number of seconds: 5
    Then I expect to see second item input ready for typing with the following placeholder: "Текст пункта"

  Scenario: Removing several items inputs
    And I press the "add item" button 3 times
    And I hover "first item container" and press the "remove first item" button
    And I hover "third item container" and press the "remove third item" button
    And I hover "forth item container" and press the "remove forth item" button
    Then I expect to see the "first item" input disabled
    Then I expect to see the "third item" input disabled
    Then I expect to see the "forth item" input disabled
    And I hover "list title" input
    Then I expect to see the following number of "cancel item removal" buttons on the page: 3
    And I wait for "the removal pawl countdown to pass" for the following number of seconds: 5
    Then I expect to see the only one item input left on the page

  Scenario: Canceling several items inputs removal
    And I press the "add item" button 2 times
    And I hover "second item container" and press the "remove second item" button
    And I hover "third item container" and press the "remove third item" button
    And I press the "cancel second item removal" button
    And I press the "cancel third item removal" button
    And I wait for "the removal pawl countdown to pass" for the following number of seconds: 5
    Then I expect to see 3 items inputs ready for typing

  Scenario: Seeing remove item button on item input hover
    And I press the "add item" button
    And I hover "first item" input
    Then I expect to see the "remove first item" button
    Then I expect to see the following number of "remove item" buttons on the page: 1

  Scenario: Seeing remove item button on its own hover
    And I press the "add item" button
    And I hover "first item container"
    And I hover "remove first item" button
    Then I expect to see the "remove first item" button
    Then I expect to see the following number of "remove item" buttons on the page: 1

  Scenario: Seeing remove item button on item input container hover
    And I press the "add item" button
    And I hover "first item container"
    Then I expect to see the "remove first item" button
    Then I expect to see the following number of "remove item" buttons on the page: 1

  Scenario: Seeing remove item button on item input focus
    And I press the "add item" button
    And I hover "list title" input
    And I focus "first item" input
    Then I expect to see the "remove first item" button
    Then I expect to see the following number of "remove item" buttons on the page: 1

  Scenario: Seeing remove item button on its on focus
    And I press the "add item" button
    And I hover "list title" input
    And I focus "first item" input
    And I focus "remove first item" button
    Then I expect to see the "remove first item" button
    Then I expect to see the following number of "remove item" buttons on the page: 1

  Scenario: Seeing remove item button disabled for the only item input
    And I hover "first item container"
    Then I expect to see the "remove first item" button disabled

  Scenario: Seeing remove item button disabled for the only item input left not for removal
    And I press the "add item" button 2 times
    And I hover "first item container" and press the "remove first item" button
    And I hover "third item container" and press the "remove third item" button
    And I hover "second item container"
    Then I expect to see the "remove second item" button disabled

  Scenario: Adding items inputs to the limit and then deleting one item input leads to warning disappear and buttons enablement
    When I add items inputs to their limit
    And I hover "on limit item container" and press the "remove on limit item" button
    And I wait for "the removal pawl countdown to pass" for the following number of seconds: 5
    Then I expect not to see the warning about items inputs limit reached
    Then I expect to see the "add item" button enabled
    Then I expect to see the "import" button enabled
