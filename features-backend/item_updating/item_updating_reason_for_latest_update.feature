@ts-implemented
Feature: Setting reason for latest update on item's update

  Updating reason for latest update to highlight item's changes.

  Possible reason for latest update changes:
  - Present — ✓,
  - Absent — ✓,
  - Empty — ✓,
  - Incorrect — ╳.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update
    And I provide an updated content
    And I provide a reason for latest update
    Then I successfully update the item and see properly sorted updated version of it
    And I want to do item update again
    And I provide another purpose

  Scenario: Providing reason for latest update on item's update
    And I provide another reason for latest update
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then updated item contains another reason for latest update

  Scenario Outline: Updating item without providing reason for latest update
    And I provide the following absent or empty reason for latest update: <reason for latest update>
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then item contains reason for latest update in its default state
    Examples:
      | reason for latest update |
      | absent                   |
      | ""                       |
      | null                     |

  Scenario Outline: Attempting to update an item with incorrect reason for latest update
    But I provide incorrect reason for latest update: <reason for latest update>
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "reason-for-latest-update-incorrect"
    Examples:
      | reason for latest update |
      | false                    |
      | true                     |
      | 123                      |
      | {}                       |
      | []                       |
