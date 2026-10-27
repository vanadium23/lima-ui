@ts-implemented
Feature: Updating a svernik with non-relevant fields

  Non-relevant fields are simply ignored.

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

  Scenario: Updating a svernik with non-relevant fields
    And I provide several non-relevant fields
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Essence doesn't reflect these non-relevant fields

  Scenario: Updating a svernik with non-user-provided fields
    And I provide values for non-user-provided svernik fields
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Svernik doesn't reflect non-user-provided fields values
