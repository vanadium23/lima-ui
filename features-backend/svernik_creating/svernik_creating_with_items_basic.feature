@ts-implemented
Feature: Creating a svernik with items, basic specification

  At the time of svernik creation, a user can provide items in some basic form, correct or incorrect one.

  Possible items states:
  - Absent — ✓,
  - Empty — ✓,
  - Incorrect — ╳,
  - Present — ✓.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose

  Scenario Outline: Attempting to create a list without items
    And I provide the following absent or empty items: <items>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <items-error>
    Examples:
      | items  | items-error     |
      | absent | "items-missing" |
      | []     | "items-empty"   |
      | null   | "items-empty"   |

  Scenario Outline: Attempting to create a svernik with items of incorrect type
    But I provide items of incorrect type: <items>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "items-incorrect"
    Examples:
      | items         |
      | "some string" |
      | 123           |
      | {}            |
      | false         |
      | true          |
