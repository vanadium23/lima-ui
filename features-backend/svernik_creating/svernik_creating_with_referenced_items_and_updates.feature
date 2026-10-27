@ts-implemented
Feature: Creating a list with referenced items and update them

  User can create list and reference the already existing items.
  Basic scenario for it is to include id, and just link item to list. It is already described in
  the feature "Creating svernik with referenced items".

  In this feature, we provide id and content for the item, and then we update within list update request.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    When I want to create a new list with referenced items
    And I provide a name
    And I provide a purpose


  Scenario: Creating a list with linked item and update content
    And I update last item with other content
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id in non-default state
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the other content
    Then item contains purpose in its default state
    Then item contains reason for latest update in its default state
    Then item contains note in its default state
    Then item contains the original list
    Then item contains the exported data
    Then item contains the user id
    Then I overviewed all fields in item


  Scenario: Creating a list with linked item and update purpose
    And I update last item with other purpose
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id in non-default state
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the previous content
    Then item contains the other purpose
    Then item contains reason for latest update in its default state
    Then item contains note in its default state
    Then item contains the original list
    Then item contains the exported data
    Then item contains the user id
    Then I overviewed all fields in item


  Scenario: Creating a list with linked item and update note
    And I update last item with other note
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id in non-default state
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the previous content
    Then item contains purpose in its default state
    Then item contains reason for latest update in its default state
    Then item contains the other note
    Then item contains the original list
    Then item contains the exported data
    Then item contains the user id
    Then I overviewed all fields in item

  Scenario Outline: Attempting to create a list with referenced item with erroneous link
    But I provide an empty or incorrect link to the last item: <item link>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Then I see the erroneous essence's index in the error message
    Then I see the erroneous essence's textual representation in the error message
    Examples:
      | item link    | error message           |
      | ""           | "reference-empty"       |
      | null         | "reference-empty"       |
      | false        | "reference-incorrect"   |
      | true         | "reference-incorrect"   |
      | 123          | "reference-incorrect"   |
      | {}           | "reference-incorrect"   |
      | []           | "reference-incorrect"   |
      | "item-hello" | "reference-unavailable" |

  Scenario: Attempting to create a list with referenced item and same content
    But I provide same content to the last item
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "reference-update-repeat-current"

  Scenario Outline: Attempting to create a list with referenced item with corrupted content
    But I provide a corrupted content to the last item: <content>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Then I see the erroneous essence's index in the error message
    Examples:
      | content | error message            |
      | ""      | "item-content-empty"     |
      | null    | "item-content-empty"     |
      | false   | "item-content-incorrect" |
      | true    | "item-content-incorrect" |
      | 123     | "item-content-incorrect" |
      | {}      | "item-content-incorrect" |
      | []      | "item-content-incorrect" |

  Scenario Outline: Attempting to create a list with referenced item with corrupted purpose
    But I provide a corrupted purpose to the last item: <purpose>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-purpose-incorrect"
    Then I see the erroneous essence's index in the error message
    Examples:
      | purpose |
      | false   |
      | true    |
      | 123     |
      | {}      |
      | []      |

  Scenario Outline: Create a list with referenced item with empty purpose
    And I provide an empty purpose to the last item: <purpose>
    And I update last item content with length: 200
    Then I successfully create a properly sorted svernik
    Examples:
      | purpose |
      | null    |
      | ""      |

  Scenario Outline: Attempting to create a list with referenced item with corrupted note
    But I provide a corrupted note to the last item: <note>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-note-incorrect"
    Then I see the erroneous essence's index in the error message
    Examples:
      | note  |
      | false |
      | true  |
      | 123   |
      | {}    |
      | []    |

  Scenario Outline: Create a list with referenced item with empty note
    And I provide an empty note to the last item: <note>
    And I update last item content with length: 200
    Then I successfully create a properly sorted svernik
    Examples:
      | note |
      | null |
      | ""   |

  Scenario Outline: Attempting to create a list with referenced item with too long content
    And I update last item content with length: <length>
    Then my attempt to create a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-content-too-long"
    Then I see the erroneous essence's index in the error message
    Examples:
      | length |
      | 201    |
      | 234    |

  Scenario: Create a list with referenced item with very long content
    And I update last item content with length: 200
    Then I successfully create a properly sorted svernik


  Scenario: Create a list with referenced item with new reason for update
    And I update last item with other reason for latest update
    Then I successfully create a properly sorted svernik
    Then Created list contains one item
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id in non-default state
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the previous content
    Then item contains purpose in its default state
    Then item contains other reason for latest update
    Then item contains note in its default state
    Then item contains the original list
    Then item contains the exported data
    Then item contains the user id
    Then I overviewed all fields in item

  Scenario Outline: Create a list with referenced item with empty reason for latest update
    And I update last item with other content
    And I provide an empty reason for latest update to the last item: <reason for latest update>
    Then I successfully create a properly sorted svernik
    Examples:
      | reason for latest update |
      | ""                       |
      | null                     |

  Scenario Outline: Attempting to create a list with referenced item incorrect reason for latest update
    But I provide incorrect reason for latest update to the last item: <reason for latest update>
    Then my attempt to create a svernik fails
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
