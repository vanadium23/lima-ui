@ts-implemented
Feature: Errors of different fields are independent and provided simultaneously

  Scenario Outline: Seeing all errors of erroneous fields
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update
    But I provide an empty or incorrect content: <content>
    But I provide incorrect purpose: {}
    But I provide incorrect reason for latest update: true
    But I provide incorrect note: []
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors in the exact order: <errors messages>
    Examples:
      | content | errors messages                                                                                                   |
      | ""      | "[\"item-content-empty\", \"purpose-incorrect\", \"note-incorrect\", \"reason-for-latest-update-incorrect\"]"     |
      | false   | "[\"item-content-incorrect\", \"purpose-incorrect\", \"note-incorrect\", \"reason-for-latest-update-incorrect\"]" |

