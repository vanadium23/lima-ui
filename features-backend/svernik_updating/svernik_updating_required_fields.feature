@ts-implemented
Feature: The required part of sverniks' updates

  Reason for latest update accompanied by the mark of the absence of a reason for latest update
  are twins of the existence reason and the corresponding mark. In some sense the ones for update
  are reasons for movement while the existence ones are reasons for stasis.

  MRU ╲ RfU │ Absent │ null  │ ""  │ Incorrect │ Present
  ──────────┼────────┼───────┼─────┼───────────┼─────────
  Absent    │   ╳    │   ╳   │  ╳  │     ╳     │    ✓
  Incorrect │   ╳    │   ╳   │  ╳  │     ╳     │    ╳
  Null      │   ╳    │   ╳   │  ╳  │     ╳     │    ✓
  False     │   ╳    │   ╳   │  ╳  │     ╳     │    ✓
  True      │   ✓    │   ✓   │  ✓  │     ╳     │    ✓

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide several correct items


  Scenario Outline: Updating svernik with a reason for latest update
    And I provide a reason for latest update
    And I provide the following mark of the absence of a reason for latest update: <mark of the absence of a reason for latest update>
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then updated svernik contains the provided reason for latest update
    Then updated svernik contains mark of the presence of a reason for latest update
    Examples:
      | mark of the absence of a reason for latest update |
      | absent                                            |
      | null                                              |
      | false                                             |
      # The mark is simply ignored in this case.
      | true                                              |

  Scenario Outline: Updating svernik without a reason for latest update
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    And I want to do svernik update again
    And I provide several correct items
    And I provide the following absent or empty reason for latest update: <reason for latest update>
    Then I need to explicitly state the absence of a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated svernik contains reason for latest update in its default state
    Then Updated svernik contains mark of the absence of a reason for latest update
    Examples:
      | reason for latest update |
      | absent                   |
      | ""                       |
      | null                     |

  Scenario Outline: Attempting to update svernik with incorrect reason for latest update
    But I provide incorrect reason for latest update: <reason for latest update>
    And I provide any mark of the absence of a reason for latest update
    Then my several attempts to update a svernik fail
    Then I see the following HTTP status code: 400
    Then I see the following error: "reason-for-latest-update-incorrect"
    Examples:
      | reason for latest update |
      | false                    |
      | true                     |
      | 123                      |
      | {}                       |
      | []                       |

  Scenario Outline: Attempting to update svernik with incorrect mark of the absence of a reason for latest update
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    And I want to do svernik update again
    And I provide several correct items
    But I provide the following incorrect mark of the absence of a reason for latest update: <mark of the absence of a reason for latest update>
    And I provide any valid reason for latest update
    Then my several attempts to update a svernik fail
    Then I see the following HTTP status code: 400
    Then I see the following error: "no-documented-reason-for-latest-update-incorrect"
    Examples:
      | mark of the absence of a reason for latest update |
      | ""                                                |
      | "non-empty string"                                |
      | 123                                               |
      | []                                                |
      | {}                                                |

  Scenario Outline: Attempting to create a svernik without reason for latest update and without the explicit mark of its absence
    # This step is required as when missing there are other errors appearing.
    And I provide another name
    And I provide the following absent or empty reason for latest update: <reason for latest update>
    But I provide the following absent or empty mark of the absence of a reason for latest update: <mark of the absence of a reason for latest update>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <reason for latest update and its mark error message>
    Examples:
      | reason for latest update | mark of the absence of a reason for latest update | reason for latest update and its mark error message |
      | absent                   | absent                                            | "reason-for-latest-update-missing-without-mark"     |
      | absent                   | false                                             | "reason-for-latest-update-missing-without-mark"     |
      | absent                   | null                                              | "reason-for-latest-update-missing-without-mark"     |
      | ""                       | absent                                            | "reason-for-latest-update-empty-without-mark"       |
      | ""                       | false                                             | "reason-for-latest-update-empty-without-mark"       |
      | ""                       | null                                              | "reason-for-latest-update-empty-without-mark"       |
      | null                     | absent                                            | "reason-for-latest-update-empty-without-mark"       |
      | null                     | false                                             | "reason-for-latest-update-empty-without-mark"       |
      | null                     | null                                              | "reason-for-latest-update-empty-without-mark"       |
