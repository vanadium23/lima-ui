@ts-implemented
Feature: Creating a svernik with non-relevant fields

  Non-relevant fields are simply ignored.

  Scenario: Creating a svernik with non-relevant fields
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several items with correct content
    And I provide several non-relevant fields
    Then I successfully create a properly sorted svernik
    Then Essence doesn't reflect these non-relevant fields

  # TODO: Специфицировать игнорирование предоставления непользовательских полей.
