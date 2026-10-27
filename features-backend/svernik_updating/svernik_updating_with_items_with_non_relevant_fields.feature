@ts-implemented
Feature: Updating a svernik with items with non-relevant fields

  Non-relevant fields in items are simply ignored.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I use the already existing items as the base

  Scenario: Updating a svernik with item with non-relevant fields
    And I provide an item with correct content
    And The provided item gets several non-relevant fields
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    Then Item doesn't reflect these non-relevant fields

  Scenario: Updating a svernik with items with non-relevant fields
    And I provide several correct items
    And The provided items get several non-relevant fields
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Items don't reflect these non-relevant fields
