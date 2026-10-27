@ts-implemented
Feature: Updating svernik's purpose

  Reason for existence can also transform during the life of a svernik.

  MRE ╲ RfE │ Absent │ null  │ ""  │ Incorrect │ Present
  ──────────┼────────┼───────┼─────┼───────────┼─────────
  Absent    │   NC*  │   ╳   │  ╳  │     ╳     │    ✓
  Incorrect │   ╳    │   ╳   │  ╳  │     ╳     │    ╳
  Null      │   ╳    │   ╳   │  ╳  │     ╳     │    ✓
  False     │   ╳    │   ╳   │  ╳  │     ╳     │    ✓
  True      │   ✓    │   ✓   │  ✓  │     ╳     │    ✓

  * NC — nothing changes.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several items with correct content
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I provide several correct items

  Scenario: Updating svernik's purpose
    And I provide another purpose
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated svernik contains the provided purpose

  Scenario: Updating list with long purpose
    And I provide another purpose with length: 150
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200

  Scenario Outline: Updating svernik's existence reasoning without a purpose
    And I provide the following absent or empty purpose: <purpose>
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated svernik contains purpose in its default state
    Examples:
      | purpose |
      | ""      |
      | null    |

  Scenario Outline: Attempting to update svernik with the incorrect purpose
    But I provide incorrect purpose: <purpose>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "purpose-incorrect"
    Examples:
      | purpose |
      | false   |
      | true    |
      | 123     |
      | {}      |
      | []      |

  Scenario: Updating svernik with missing purpose
    And I provide the following absent or empty purpose: absent
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    # TODO: Ожидать здесь сохранения предыдущего значения причины и отметки.

  Scenario Outline: Attempting to update list with too long purpose
    And I provide another purpose with length: <length>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "purpose-too-long"
    Examples:
      |length |
      | 151   |
      | 234   |
