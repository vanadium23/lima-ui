@ts-implemented
Feature: Updating an item with non-relevant fields

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update
    And I provide a reason for latest update

  Scenario: Updating an item with non-relevant fields
    And I provide several non-relevant fields
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Essence doesn't reflect these non-relevant fields

  Scenario: Updating an item with non-user-provided fields
    And I provide values for non-user-provided item fields
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Item doesn't reflect non-user-provided fields values
