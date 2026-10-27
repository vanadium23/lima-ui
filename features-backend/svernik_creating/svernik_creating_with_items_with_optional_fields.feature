@ts-implemented
Feature: Creating a svernik with items with optional fields

  Optional fields for item are:
  - Purpose,
  - Note.

  Item data purpose possible states:
  - Present — ✓,
  - Absent — ✓,
  - Empty — ✓,
  - Incorrect — ╳.

  Item data note possible states:
  - Present — ✓,
  - Absent — ✓,
  - Empty — ✓,
  - Incorrect — ╳.

  Reason for latest update and the corresponding mark is ignored at the time of svernik creation.

  State     │ Purpose │ Note  │ Reason for latest update
  ──────────┼─────────┼───────┼──────────────────────────
  Present   │    ✓    │   ✓   │             ✓
  Absent    │    ✓    │   ✓   │             ✓
  Empty     │    ✓    │   ✓   │             ✓
  Incorrect │    ╳    │   ╳   │             ✓

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content

  Scenario: Creating a svernik with item with a purpose
    And The provided item gets a purpose
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    Then item contains the provided purpose

  Scenario Outline: Creating a svernik with item without a purpose
    And The provided item gets the following absent or empty purpose: <purpose>
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    Then item contains purpose in its default state
    Examples:
      | purpose |
      | absent  |
      | ""      |
      | null    |

  Scenario Outline: Attempting to create a svernik with item with the incorrect purpose
    But The provided item gets the following incorrect purpose: <purpose>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-purpose-incorrect"
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message
    Examples:
      | purpose |
      | false   |
      | true    |
      | 123     |
      | {}      |
      | []      |


  Scenario: Creating a svernik with item with a note
    And The provided item gets a note
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    Then item contains the provided note

  Scenario Outline: Creating a svernik with item without a note
    And The provided item gets the following absent or empty note: <note>
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    Then item contains note in its default state
    Examples:
      | note   |
      | absent |
      | ""     |
      | null   |

  Scenario Outline: Attempting to create a svernik with item with the incorrect note
    But The provided item gets the following incorrect note: <note>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-note-incorrect"
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message
    Examples:
      | note  |
      | false |
      | true  |
      | 123   |
      | {}    |
      | []    |

  Scenario Outline: Attempting to create a svernik with mixed items with erroneous optional fields and correct items
    But I provide several corrupt items: <items with incorrect optional fields>
    And I provide several correct items
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: <error messages>
    Examples:
      | items with incorrect optional fields                                                                        | error messages                                            |
      | "[{\"content\": \"Valid content\", \"purpose\": false}, {\"content\": \"Valid content\", \"purpose\": {}}]" | "[\"item-purpose-incorrect\" \"item-purpose-incorrect\"]" |
      | "[{\"content\": \"Valid content\", \"purpose\": []}, {\"content\": \"Valid content\", \"note\": {}}]"       | "[\"item-purpose-incorrect\" \"item-note-incorrect\"]"    |
      | "[{\"content\": \"Valid content\", \"note\": 31415}, {\"content\": \"Valid content\", \"note\": false}]"    | "[\"item-note-incorrect\" \"item-note-incorrect\"]"       |

  Scenario Outline: Creating a list with item without or with present reason for latest update
    And The provided item gets any absent or present reason for latest update: <reason for latest update>
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    Then item contains reason for latest update in its default state
    Examples:
      | reason for latest update |
      | absent                   |
      | null                     |
      | ""                       |
      | "non-empty string"       |

  Scenario Outline: Attempting to create a list with item with incorrect reason for latest update
    And The provided item gets any absent or present reason for latest update: <reason for latest update>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-reason-for-latest-update-incorrect"
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message
    Examples:
      | reason for latest update |
      | false                    |
      | true                     |
      | 123                      |
      | {}                       |
      | []                       |
