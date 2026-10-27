@ts-implemented
Feature: Updating a svernik with items with optional fields

  See "Creating a svernik with items with optional fields" feature description for the full information.

  In short, purpose and note are optional.
  Reason for latest update and the corresponding mark is ignored at the time of svernik creation.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I use the already existing items as the base
    And I provide an item with correct content

  Scenario: Updating a svernik with item with a purpose
    And The provided item gets a purpose
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    Then item contains the provided purpose

  Scenario Outline: Updating a svernik with item without a purpose
    And The provided item gets the following absent or empty purpose: <purpose>
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    Then item contains purpose in its default state
    Examples:
      | purpose |
      | absent  |
      | ""      |
      | null    |

  Scenario Outline: Attempting to update a svernik with item with the incorrect purpose
    But The provided item gets the following incorrect purpose: <purpose>
    Then my attempt to update a svernik fails
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

  Scenario: Updating a svernik with item with a note
    And The provided item gets a note
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    Then item contains the provided note

  Scenario Outline: Updating a svernik with item without a note
    And The provided item gets the following absent or empty note: <note>
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    Then item contains note in its default state
    Examples:
      | note   |
      | absent |
      | ""     |
      | null   |

  Scenario Outline: Attempting to update a svernik with item with the incorrect note
    But The provided item gets the following incorrect note: <note>
    Then my attempt to update a svernik fails
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

  Scenario Outline: Attempting to update a svernik with mixed items with erroneous optional fields and correct items
    But I provide several corrupt items: <items with incorrect optional fields>
    And I provide several correct items
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: <error messages>
    Examples:
      | items with incorrect optional fields                                                                        | error messages                                            |
      | "[{\"content\": \"Valid content\", \"purpose\": false}, {\"content\": \"Valid content\", \"purpose\": {}}]" | "[\"item-purpose-incorrect\" \"item-purpose-incorrect\"]" |
      | "[{\"content\": \"Valid content\", \"purpose\": []}, {\"content\": \"Valid content\", \"note\": {}}]"       | "[\"item-purpose-incorrect\" \"item-note-incorrect\"]"    |
      | "[{\"content\": \"Valid content\", \"note\": 31415}, {\"content\": \"Valid content\", \"note\": false}]"    | "[\"item-note-incorrect\" \"item-note-incorrect\"]"       |

  Scenario Outline: Updating a svernik with item without or with present reason for latest update
    And The provided item gets any absent or present reason for latest update: <reason for latest update>
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    Then item contains reason for latest update in its default state
    Examples:
      | reason for latest update |
      | absent                   |
      | null                     |
      | ""                       |
      | "non-empty string"       |

  Scenario Outline: Attempting to update a svernik with item with incorrect reason for latest update
    And The provided item gets any absent or present reason for latest update: <reason for latest update>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-reason-for-latest-update-incorrect"
    Then I see the erroneous essence's index in the error message
    Examples:
      | reason for latest update |
      | false                    |
      | true                     |
      | 123                      |
      | {}                       |
      | []                       |
