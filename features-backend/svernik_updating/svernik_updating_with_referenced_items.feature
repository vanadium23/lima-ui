@ts-implemented
Feature: Updating a svernik with referenced items

  The rules for adding references to items on update are the same as when creating a svernik.

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

  Scenario: Updating a svernik with linked item
    And I provide a link to available item
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    Then Item is the already existing item

  Scenario: Updating a svernik with several linked items
    And I provide links to several available items
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Items are the already existing items

  Scenario Outline: Attempting to update a svernik with item with erroneous link
    But I provide an empty or incorrect link to the item: <item link>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message
    Examples:
      | item link | error message         |
      | ""        | "reference-empty"     |
      | null      | "reference-empty"     |
      | false     | "reference-incorrect" |
      | true      | "reference-incorrect" |
      | 123       | "reference-incorrect" |
      | {}        | "reference-incorrect" |
      | []        | "reference-incorrect" |

  Scenario: Attempting to update a svernik with item with unavailable link
    But I provide a link to the unavailable item
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "reference-unavailable"
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message

  Scenario: Attempting to update a svernik with several items with unavailable link
    But I provide links to several unavailable essences: "[{\"id\": \"item-hello\"}, {\"id\": \"item-world\"}]"
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: "[\"reference-unavailable\" \"reference-unavailable\"]"

  Scenario: Updating a svernik with item linked several times
    And I provide a link to available item
    And I provide a link to available item
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated svernik contains more than two essences
    Then Both items are the already existing item and equal to each other


  # References relations with other types of items input.

  Scenario: Updating a svernik with mixed referenced and correct items
    And I provide a link to available item
    And I provide an item with correct content
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated svernik contains more than two essences
    Then Updated svernik contains the already existing item on the pre-last position

  Scenario: Attempting to update a svernik with mixed referenced and incorrect items
    And I provide a link to available item
    But I provide one incorrect item: null
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-incorrect"
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message

  Scenario: Attempting to update a svernik with mixed referenced, incorrect and corrupt items
    And I provide a link to available item
    But I provide several incorrect items: "[\"some string\", 123]"
    But I provide several corrupt items: "[{}, {\"content\": 123}]"
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: "[\"item-incorrect\", \"item-incorrect\", \"item-content-missing\" \"item-content-incorrect\"]"

  Scenario: Attempting to update a svernik with mixed referenced, incorrect, corrupt and correct items
    And I provide a link to available item
    But I provide several incorrect items: "[false, null]"
    But I provide several corrupt items: "[{\"content\": \"\"}, {\"content\": true}]"
    And I provide an item with correct content
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: "[\"item-incorrect\", \"item-incorrect\", \"item-content-empty\" \"item-content-incorrect\"]"

  Scenario: Attempting to update a svernik with mixed referenced and corrupt items
    And I provide a link to available item
    But I provide several corrupt items: "[{\"content\": 4444}, {\"content\": null}]"
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: "[\"item-content-incorrect\" \"item-content-empty\"]"

  Scenario: Attempting to update a svernik with mixed referenced, corrupt and correct items
    And I provide a link to available item
    But I provide several corrupt items: "[{\"content\": \"\"}, {\"content\": null}]"
    And I provide an item with correct content
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: "[\"item-content-empty\" \"item-content-empty\"]"
