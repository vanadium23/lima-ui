@ts-implemented
Feature: Exploring lists

  My treasures are a set of lists helping me support quality while facing a sleepy routine or stressful situation.

  Background:
    Given I am "user@example.com"

  Scenario: Seeing lists
    When I ask for all my lists
    # TODO: Добавить ожидание отсортированности списков.
    Then I see the following HTTP status code: 200
    Then I receive a collection of lists
    Then I see lists' ids
    Then I see lists' version ids
    Then I see lists' older version ids
    Then I see lists' newer version ids in their default state
    Then I see lists' type
    Then I see lists' user ids
    Then I see lists' date and time of creation
    Then I see lists' URLs
    Then I see lists' names
    Then I see lists' purpose
    Then I see lists' lists of items
    Then I see some lists' referencing lists among items
    Then I see lists' exported data
    Then I see lists referencing lists among exported data
    Then I see lists' reasons for latest update or marks of the absence of a reason for latest update
    Then I see present or empty lists' notes
    Then I overviewed all fields in the lists

  Scenario: Seeing lists after update
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I provide another name
    And I provide another purpose
    And I provide several items with correct content
    Then I successfully update the svernik and see properly sorted updated version of it
    When I ask for all my lists
    # TODO: Добавить ожидание отсортированности списков.
    Then I receive a collection of lists
    Then I see lists' ids
    Then I see lists' version ids
    Then I see lists' older version ids
    Then I see lists' newer version ids in their default state
    Then I see lists' type
    Then I see lists' user ids
    Then I see lists' date and time of creation
    Then I see lists' URLs
    Then I see lists' names
    Then I see lists' purpose
    Then I see lists' lists of items
    Then I see some lists' referencing lists among items
    Then I see lists' reasons for latest update or marks of the absence of a reason for latest update
    Then I see present or empty lists' notes
    Then I see lists' exported data
    Then I see lists referencing lists among exported data
    Then I overviewed all fields in the lists
