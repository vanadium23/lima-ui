@ts-implemented
Feature: Updating svernik's items, basic specification

  At the time of svernik update, a user can provide items in some basic form, correct or incorrect one.

  Possible items updates:
  - Absent — nothing changes,
  - Empty — ✓,
  - Incorrect — ╳,
  - Present — ✓.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update

  Scenario Outline: Attempting to update a svernik with empty items
    And I provide the following absent or empty items: <items>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "items-empty"
    Examples:
      | items |
      | []    |
      | null  |

  Scenario Outline: Attempting to update a svernik with items of incorrect type
    But I provide items of incorrect type: <items>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "items-incorrect"
    Examples:
      | items         |
      | "some string" |
      | 123           |
      | {}            |
      | false         |
      | true          |
