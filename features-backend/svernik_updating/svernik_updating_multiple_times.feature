@ts-implemented
Feature: Updating svernik multiple times is expected and even desired

  Scenario: Updating svernik multiple times
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I consequently update svernik some random number of times
    Then On any update I see properly sorted updated version of the svernik
    Then On every update I see the following HTTP status code: 200
