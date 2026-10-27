@ts-implemented
Feature: Ensuring all svernik properties are in place after the update

  Scenario: Updating a svernik with some information
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I provide another name
    And I provide another purpose
    And I provide several correct items
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    And I want to do the precise investigation of the svernik
    Then Svernik contains the id
    Then Svernik contains the version id
    Then Svernik contains the older version id
    Then Svernik contains the newer version id in its default state
    Then Svernik contains the type
    Then Svernik contains date and time of creation
    Then Svernik contains the URL
    Then Svernik contains the provided name
    Then Svernik contains the provided purpose
    Then List contains several correct items
    Then essence contains reason for latest update
    Then Svernik contains mark of the presence of a reason for latest update
    Then Svernik contains note in its default state
    Then List contains exported data in its default state
    Then Svernik contains the user id
    Then I overviewed all fields in a list
