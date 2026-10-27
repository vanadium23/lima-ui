@ts-implemented
Feature: Updating svernik's name

  Sometimes you need to give your svernik a better name.

  Possible name updates:
  - Absent — nothing changes,
  - Present — ✓,
  - Empty — ╳,
  - Incorrect — ╳.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I provide several correct items

  Scenario: Updating name of a svernik
    And I provide another name
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated svernik contains the provided name
    Then updated svernik contains the provided reason for latest update
    Then updated svernik contains mark of the presence of a reason for latest update

  Scenario Outline: Attempting to update a svernik with erroneous name
    But I provide an empty or incorrect name: <name>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Examples:
      | name  | error message    |
      | ""    | "name-empty"     |
      | null  | "name-empty"     |
      | 123   | "name-incorrect" |
      | {}    | "name-incorrect" |
      | []    | "name-incorrect" |
      | false | "name-incorrect" |
      | true  | "name-incorrect" |

  Scenario: Updating name of a list with long name
    And I provide an another name with length: 70
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200

  Scenario Outline: Attempting to update a list with too long name
    And I provide an another name with length: <length>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "name-too-long"
    Examples:
      | length |
      | 71     |
      | 123    |
