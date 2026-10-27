@ts-implemented
Feature: Updating item multiple times is expected and also desired

  Scenario: Updating item multiple times
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update
    And I consequently update item some random number of times
    Then On any update I see properly sorted updated version of the item
    Then On every update I see the following HTTP status code: 200
