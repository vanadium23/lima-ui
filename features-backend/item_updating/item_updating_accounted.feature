@ts-implemented
Feature: Ensuring all item properties are in place after the update


  Scenario: Updating an item with some information
    Given I am "user@example.com"
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update
    And I provide a reason for latest update
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    And I want to do the precise investigation of the item
    Then item contains the id
    Then item contains the version id
    Then item contains the older version id
    Then item contains the newer version id in its default state
    Then item contains the type
    Then item contains the date and time of creation
    Then item contains the URL
    Then item contains the provided content
    Then item contains purpose
    Then item contains reason for latest update
    Then item contains note in its default state
    Then item contains the original list
    Then item contains the exported data
    Then item contains the user id
    Then I overviewed all fields in item
