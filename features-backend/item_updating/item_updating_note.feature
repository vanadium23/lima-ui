@ts-implemented
Feature: Updating item's note

  Updating note to better expound item's details.

  Possible note updates:
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
    And The provided item gets a note
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update

  Scenario: Updating item's note
    And I provide an updated note
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated item contains the provided note

  Scenario: Updating item without providing note
    And I don't provide any updated note
    And I provide a reason for latest update
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Item's note remains the same

  Scenario Outline: Clearing item's note on update
  Absent is a separate case now.
    And I provide the following absent or empty note: <note>
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then item contains note in its default state
    Examples:
      | note |
      | ""   |
      | null |

  Scenario Outline: Attempting to update an item with incorrect note
    But I provide incorrect note: <note>
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "note-incorrect"
    Examples:
      | note  |
      | false |
      | true  |
      | 123   |
      | {}    |
      | []    |
