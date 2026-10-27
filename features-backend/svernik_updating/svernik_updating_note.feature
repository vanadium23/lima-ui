@ts-implemented
Feature: Updating svernik's note

  Updating note to better expound svernik's details.

  Possible note updates:
  - Absent — nothing changes,
  - Present — ✓,
  - Empty — ✓,
  - Incorrect — ╳.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide a note
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I provide several correct items

  Scenario: Updating note of a svernik
    And I provide an updated note
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated svernik contains the provided note

  Scenario: Updating list with a long note
    And I provide an updated note with length: 500
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200

  Scenario Outline: Clearing svernik's note on update
    And I provide the following absent or empty note: <note>
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated svernik contains note in its default state
    Examples:
      | note |
      | ""   |
      | null |

  Scenario Outline: Attempting to update a svernik with the incorrect note
    But I provide incorrect note: <note>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <note error message>
    Examples:
      | note  | note error message |
      | false | "note-incorrect"   |
      | true  | "note-incorrect"   |
      | 123   | "note-incorrect"   |
      | {}    | "note-incorrect"   |
      | []    | "note-incorrect"   |

  Scenario Outline: Attempting to update a list with the too long note
    And I provide an updated note with length: <length>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "note-too-long"
    Examples:
      | length |
      | 501    |
      | 567    |
