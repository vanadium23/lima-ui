@ts-implemented
Feature: Attempting to create svernik with incorrect items

  At the time of svernik creation user can provide incorrect items. For now Svernik will handle this easily by rejecting
  the whole svernik creation.

  Number of errors corresponds to the number of erroneous items in the update.

  There are several mixes of the three item types (correct, incorrect, corrupt) when the incorrect is present:
  - incorrect,
  - incorrect, corrupt,
  - incorrect, correct,
  - incorrect, correct, corrupt.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose

  Scenario Outline: Attempting to create a svernik with single incorrect item
    But I provide one incorrect item: <incorrect item>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-incorrect"
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message
    Examples:
      | incorrect item |
      | ""             |
      | "some string"  |
      | 123            |
      | []             |
      | false          |
      | true           |
      | null           |

  Scenario Outline: Attempting to create a svernik with multiple incorrect items
    But I provide several incorrect items: <incorrect items>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: <items incorrect error messages>
    Examples:
      | incorrect items                | items incorrect error messages                                                     |
      | "[\"\", \"some string\", 123]" | "[\"item-incorrect\", \"item-incorrect\", \"item-incorrect\"]"                     |
      | "[[], false, true, null]"      | "[\"item-incorrect\", \"item-incorrect\", \"item-incorrect\", \"item-incorrect\"]" |

  Scenario: Attempting to create a svernik with mixed incorrect and corrupt items
    But I provide several incorrect items: "[\"some string\", 123]"
    But I provide several corrupt items: "[{}, {\"content\": 123}]"
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: "[\"item-incorrect\", \"item-incorrect\", \"item-content-missing\" \"item-content-incorrect\"]"

  Scenario: Attempting to create a svernik with mixed incorrect, corrupt and correct items
    But I provide several incorrect items: "[\"some string\", 123]"
    But I provide several corrupt items: "[{}, {\"content\": 123}]"
    And I provide several correct items
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: "[\"item-incorrect\", \"item-incorrect\", \"item-content-missing\" \"item-content-incorrect\"]"

  Scenario Outline: Attempting to create a svernik with mixed incorrect and correct items
    But I provide several incorrect items: <incorrect items>
    And I provide several correct items
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: <items incorrect error messages>
    Examples:
      | incorrect items                | items incorrect error messages                                                     |
      | "[\"\", \"some string\", 123]" | "[\"item-incorrect\", \"item-incorrect\", \"item-incorrect\"]"                     |
      | "[[], false, true, null]"      | "[\"item-incorrect\", \"item-incorrect\", \"item-incorrect\", \"item-incorrect\"]" |
