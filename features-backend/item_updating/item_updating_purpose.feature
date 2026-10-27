@ts-implemented
Feature: Updating item's purpose

  Possible purpose updates:
  - Present — ✓,
  - Absent — nothing changes,
  - Empty — ✓,
  - Incorrect — ╳.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    And The provided item gets a purpose
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update

  Scenario: Updating item's purpose
    And I provide another purpose
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated item contains the provided purpose

  Scenario: Updating item without providing purpose
    And I don't provide any updated purpose
    And I provide a reason for latest update
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Item's purpose remains the same

  Scenario Outline: Clearing item's purpose on update
  Absent is a separate case now.
    And I provide the following absent or empty purpose: <purpose>
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then item contains purpose in its default state
    Examples:
      | purpose |
      | ""      |
      | null    |

  Scenario Outline: Attempting to update an item with incorrect purpose
    But I provide incorrect purpose: <purpose>
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "purpose-incorrect"
    Examples:
      | purpose |
      | false   |
      | true    |
      | 123     |
      | {}      |
      | []      |
