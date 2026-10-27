@ts-implemented
Feature: Attempting to do an empty update to item

  At the time of item update, user can send empty data or the one that completely
  repeats the current one. The latter could mean connection issues and duplicated
  requests. Svernik rejects these types of updates.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update

  Scenario: Attempting to update item with empty data
    But I provide an empty update to essence
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-update-empty"

  Scenario: Attempting to update item with the same data
    But I provide to essence the same data which is in it
    Then my attempt to update an item with any set of the same data fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-update-repeats-current-content"

  Scenario: Attempting to update item with the same data and extra non-relevant fields
    But I provide to essence the same data which is in it
    And I provide several non-relevant fields
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-update-repeats-current-content"

  Scenario: Attempting to update item providing only non-relevant fields
    But I provide several non-relevant fields
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-update-empty"
