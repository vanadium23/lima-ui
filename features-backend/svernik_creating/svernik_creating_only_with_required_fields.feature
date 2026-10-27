@ts-implemented
Feature: Creating a svernik only with required fields

  Svernik is a lists management instrument, and creating ones is its core functionality.
  The "svernik" term means a list with traceable change history and a purpose.

  Possible name states:
  - Present — ✓,
  - Absent — ╳,
  - Empty — ╳,
  - Incorrect — ╳.

  Possible purpose states:
  - Present — ✓,
  - Absent — ✓,
  - Empty — ✓,
  - Incorrect — ✓.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide several correct items

  Scenario: Creating a svernik with the required information
    And I provide a name
    And I provide a purpose
    Then I successfully create a properly sorted svernik
    And I want to do the precise investigation of the svernik
    Then Svernik contains the id
    Then Svernik contains the version id equal to the id
    Then Svernik contains the older version id in its default state
    Then Svernik contains the newer version id in its default state
    Then Svernik contains the type
    Then Svernik contains date and time of creation
    Then Svernik contains the URL
    Then Svernik contains the provided name
    Then Svernik contains the provided purpose
    Then List contains several correct items
    Then Svernik contains reason for latest update in its default state
    Then Svernik contains mark of the absence of a reason for latest update in its default state
    Then Svernik contains note in its default state
    Then List contains exported data in its default state
    Then List contains user id
    Then I overviewed all fields in a list

  Scenario: Creating a list with a long name
    And I provide a name with length: 70
    And I provide a purpose
    Then I successfully create a properly sorted svernik

  Scenario: Creating a list with a long purpose
    And I provide a name
    And I provide a purpose with length: 150
    Then I successfully create a properly sorted svernik

  Scenario Outline: Creating a svernik without a purpose
    And I provide a name
    And I provide the following absent or empty purpose: <purpose>
    Then I successfully create a properly sorted svernik
    Then Created svernik contains purpose in its default state
    Examples:
      | purpose |
      | absent  |
      | ""      |
      | null    |

  Scenario Outline: Attempting to create a svernik with erroneous name
    But I provide the absent, empty or incorrect name: <name>
    And I provide a purpose
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Examples:
      | name   | error message    |
      | absent | "name-missing"   |
      | ""     | "name-empty"     |
      | null   | "name-empty"     |
      | 123    | "name-incorrect" |
      | {}     | "name-incorrect" |
      | []     | "name-incorrect" |
      | false  | "name-incorrect" |
      | true   | "name-incorrect" |

  Scenario Outline: Attempting to create a list with too long name
    And I provide a name with length: <length>
    And I provide a purpose
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "name-too-long"
    Examples:
      | length |
      | 71     |
      | 123    |

  Scenario Outline: Attempting to create a list with too long purpose
    And I provide a name
    And I provide a purpose with length: <length>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "purpose-too-long"
    Examples:
      | length |
      | 151    |
      | 234    |

  Scenario Outline: Attempting to create a svernik with the incorrect purpose
    And I provide a name
    But I provide incorrect purpose: <purpose>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "purpose-incorrect"
    Examples:
      | purpose |
      | false   |
      | true    |
      | 123     |
      | {}      |
      | []      |
