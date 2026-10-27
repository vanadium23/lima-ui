@ts-implemented
Feature: Creating a svernik with optional fields

  Possible note states:
  - Present — ✓,
  - Absent — ✓,
  - Empty — ✓,
  - Incorrect — ╳.


  Possible reason for latest update & mark of the absence of a reason for latest update are simply ignored:

  MRU ╲ RfU │ Absent │ Empty │ Incorrect │ Present
  ──────────┼────────┼───────┼───────────┼─────────
  Absent    │   ✓    │   ✓   │     ✓     │    ✓
  Incorrect │   ✓    │   ✓   │     ✓     │    ✓
  Null      │   ✓    │   ✓   │     ✓     │    ✓
  False     │   ✓    │   ✓   │     ✓     │    ✓
  True      │   ✓    │   ✓   │     ✓     │    ✓

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items

  Scenario: Creating a svernik with a note
    And I provide a note
    Then I successfully create a properly sorted svernik
    Then Created svernik contains the provided note

  Scenario: Creating a svernik with a long note
    And I provide a note with length: 500
    Then I successfully create a properly sorted svernik

  Scenario Outline: Creating a svernik without a note
    And I provide the following absent or empty note: <note>
    Then I successfully create a properly sorted svernik
    Then Svernik contains note in its default state
    Examples:
      | note   |
      | absent |
      | ""     |
      | null   |

  Scenario Outline: Attempting to create a svernik with the incorrect note
    But I provide incorrect note: <note>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "note-incorrect"
    Examples:
      | note  |
      | false |
      | true  |
      | 123   |
      | {}    |
      | []    |

  Scenario Outline: Attempting to create a svernik with too long note
    And I provide a note with length: <length>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "note-too-long"
    Examples:
      | length |
      | 501    |
      | 567    |

  Scenario Outline: Creating a svernik with any reason for latest update
    And I provide any absent or present reason for latest update: <reason for latest update>
    Then I successfully create a properly sorted svernik
    Then Svernik contains reason for latest update in its default state
    Then Svernik contains mark of the absence of a reason for latest update in its default state
    Examples:
      | reason for latest update |
      | absent                   |
      | null                     |
      | false                    |
      | true                     |
      | ""                       |
      | "non-empty string"       |
      | 123                      |
      | {}                       |
      | []                       |

  Scenario Outline: Creating a svernik with any mark of the absence of a reason for latest update
    And I provide any absent or present mark of the absence of a reason for latest update: <mark of the absence of a reason for latest update>
    Then I successfully create a properly sorted svernik
    Then Svernik contains reason for latest update in its default state
    Then Svernik contains mark of the absence of a reason for latest update in its default state
    Examples:
      | mark of the absence of a reason for latest update |
      | absent                                            |
      | null                                              |
      | false                                             |
      | true                                              |
      | ""                                                |
      | "non-empty string"                                |
      | 123                                               |
      | {}                                                |
      | []                                                |
