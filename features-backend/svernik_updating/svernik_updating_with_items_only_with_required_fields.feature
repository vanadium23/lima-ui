@ts-implemented
Feature: Updating a svernik with items only with required fields

  The only required field for a new item in the updated svernik is content.

  Possible content states:
  - Present — ✓,
  - Absent — ╳,
  - Empty — ╳,
  - Incorrect — ╳.

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


  Scenario: Updating a svernik with item with the required information
    And I provide an item with correct content
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id in its default state
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the provided content
    Then item contains valid purpose
    Then item contains valid reason for latest update
    Then item contains note in its default state
    Then item contains the original list
    Then item contains the exported data
    Then item contains the user id
    Then I overviewed all fields in item

  Scenario: Updating a svernik with several items with the required information
    And I provide several items with correct content
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Several last items are the ones with the provided data
    Then Items contain the id
    Then Items contain the version id
    Then Items contain the older version id in its default state
    Then Items contain the newer version id in its default state
    Then Items contain the URL
    Then Items contain the type
    Then Items contain the date and time of creation
    Then Items contain the provided content
    Then Items contain valid purpose
    Then Items contain valid reason for latest update
    Then Items contain note in its default state
    Then Items contain the original list
    Then Items contain the exported data
    Then Items contain the user id
    Then I overviewed all fields in items

  Scenario: Updating a list with maximum number of items
    # two elements already provided
    And I provide items with total number of: 498
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200

  Scenario Outline: Attempting to update a svernik with item with erroneous content
    But I provide an item with the absent, empty or incorrect content: <content>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message
    Examples:
      | content | error message            |
      | absent  | "item-content-missing"   |
      | ""      | "item-content-empty"     |
      | null    | "item-content-empty"     |
      | false   | "item-content-incorrect" |
      | true    | "item-content-incorrect" |
      | 123     | "item-content-incorrect" |
      | {}      | "item-content-incorrect" |
      | []      | "item-content-incorrect" |

  Scenario Outline: Attempting to update a svernik with several items with erroneous content
    But I provide several corrupt items: <items with erroneous content>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: <error messages>
    Examples:
      | items with erroneous content                                     | error messages                                                                       |
      | "[{}, {\"content\": \"\"}, {\"content\": null}]"                 | "[\"item-content-missing\" \"item-content-empty\" \"item-content-empty\"]"           |
      | "[{\"content\": 123}, {\"content\": {}}]"                        | "[\"item-content-incorrect\" \"item-content-incorrect\"]"                            |
      | "[{\"content\": []}, {\"content\": false}, {\"content\": true}]" | "[\"item-content-incorrect\" \"item-content-incorrect\" \"item-content-incorrect\"]" |

  Scenario Outline: Attempting to update a svernik with mixed items with erroneous content and correct items
    But I provide several corrupt items: <items with erroneous content>
    And I provide several correct items
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: <error messages>
    Examples:
      | items with erroneous content                                     | error messages                                                                       |
      | "[{}, {\"content\": \"\"}, {\"content\": null}]"                 | "[\"item-content-missing\" \"item-content-empty\" \"item-content-empty\"]"           |
      | "[{\"content\": 123}, {\"content\": {}}]"                        | "[\"item-content-incorrect\" \"item-content-incorrect\"]"                            |
      | "[{\"content\": []}, {\"content\": false}, {\"content\": true}]" | "[\"item-content-incorrect\" \"item-content-incorrect\" \"item-content-incorrect\"]" |

  Scenario Outline: Attempting to update a list with too many items
    And I provide items with total number of: <length>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "items-too-many-elements"
    # two elements already provided
    Examples:
      | length |
      | 499    |
      | 500    |
