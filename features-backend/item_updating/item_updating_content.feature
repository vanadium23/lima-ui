@ts-implemented
Feature: Updating item's content

  Changing item's content is a part of continuous improvement.

  Possible content updates:
  - Present — ✓,
  - Absent — nothing changes,
  - Empty — ╳,
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

  Scenario: Updating content of an item
    And I provide an updated content
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated item contains the provided content

  Scenario: Updating an item with long content
    And I provide an updated content with length: 200
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200

  Scenario: Updating item without providing content
    And I don't provide any updated content
    And I provide a reason for latest update
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Item's content remains the same

  Scenario Outline: Attempting to update an item with erroneous content
    But I provide an empty or incorrect content: <content>
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Examples:
      | content | error message            |
      | ""      | "item-content-empty"     |
      | null    | "item-content-empty"     |
      | false   | "item-content-incorrect" |
      | true    | "item-content-incorrect" |
      | 123     | "item-content-incorrect" |
      | {}      | "item-content-incorrect" |
      | []      | "item-content-incorrect" |

  Scenario Outline: Attempting to update an item with very long content
    And I provide an updated content with length: <length>
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-content-too-long"
    Examples:
      | length |
      | 201    |
      | 234    |
