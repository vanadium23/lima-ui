@ts-implemented
Feature: Updating a svernik with referenced items, while simultaneously updating them.

  The rules for updating referenced items are the same as when updating items on separate path.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    And last item gets a note
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I use the already existing items as the base


  Scenario: Updating a referenced list's item content
    And I update last item with other content
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id in non-default state
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the other content
    Then item contains valid purpose
    Then item contains valid reason for latest update
    Then item contains the previous note
    Then item contains the original list
    Then item contains the exported data
    Then item contains user id
    Then I overviewed all fields in item

  Scenario: Attempting to update a list with referenced item in same state
    And I update last item with same content
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "reference-update-repeat-current"
    Then I see the erroneous essence's index in the error message


  Scenario: Updating a referenced list's item purpose
    And I update last item with other purpose
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id in non-default state
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the same content
    Then item contains the other purpose
    Then item contains valid reason for latest update
    Then item contains the previous note
    Then item contains the original list
    Then item contains the exported data
    Then item contains user id
    Then I overviewed all fields in item


  Scenario: Updating a referenced list's item note
    And I update last item with other note
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id in non-default state
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the same content
    Then item contains the other note
    Then item contains valid purpose
    Then item contains valid reason for latest update
    Then item contains the original list
    Then item contains the exported data
    Then item contains user id
    Then I overviewed all fields in item

  Scenario Outline: Attempting to update a list with referenced item with erroneous link
    But I provide an empty or incorrect link to the last item: <item link>
    Then my attempt to update a svernik fails
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
      | "list-hello" | "reference-unavailable" |

  Scenario Outline: Attempting to update a list with referenced item with corrupted content
    But I provide a corrupted content to the last item: <content>
    Then my attempt to update a svernik fails
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

  Scenario Outline: Attempting to update a list with referenced item with corrupted purpose
    But I provide a corrupted purpose to the last item: <purpose>
    Then my attempt to update a svernik fails
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

  Scenario Outline: Update a list with referenced item with empty purpose
    And I provide an empty purpose to the last item: <purpose>
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Examples:
      | purpose |
      | null    |
      | ""      |

  Scenario Outline: Attempting to update a list with referenced item with corrupted note
    And I provide a corrupted note to the last item: <note>
    Then my attempt to update a svernik fails
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

  Scenario Outline: Update a list with referenced item with empty note
    And I provide an empty note to the last item: <note>
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Examples:
      | note |
      | null |
      | ""   |

  Scenario Outline: Attempting to update a list with referenced item with too long content
    And I update last item content with length: <length>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-content-too-long"
    Then I see the erroneous essence's index in the error message
    Examples:
      | length |
      | 201    |
      | 234    |

  Scenario: Update a list with referenced item with very long content
    And I update last item content with length: 200
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200


  Scenario: Update a list with referenced item with new reason for update
    And I update last item with other reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then The last item is the required one
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id in non-default state
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the same content
    Then item contains the previous note
    Then item contains valid purpose
    Then item contains other reason for latest update
    Then item contains the original list
    Then item contains the exported data
    Then item contains user id
    Then I overviewed all fields in item

  Scenario Outline: Update a list with referenced item with empty reason for latest update
    And I update last item with other content
    And I provide an empty reason for latest update to the last item: <reason for latest update>
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Examples:
      | reason for latest update |
      | ""                       |
      | null                     |

  Scenario Outline: Attempting to update a list with referenced item incorrect reason for latest update
    But I provide incorrect reason for latest update to the last item: <reason for latest update>
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
