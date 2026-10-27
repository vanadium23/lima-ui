@ts-implemented
Feature: Creating a svernik with items with non-relevant fields

  Non-relevant fields in items are simply ignored.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose

  Scenario: Creating a svernik with item with non-relevant fields
    And I provide an item with correct content
    And The provided item gets several non-relevant fields
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    Then Item doesn't reflect these non-relevant fields

  Scenario: Creating a svernik with items with non-relevant fields
    And I provide several correct items
    And The provided items get several non-relevant fields
    Then I successfully create a properly sorted svernik
    Then Items don't reflect these non-relevant fields
