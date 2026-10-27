@ts-implemented
Feature: Applying any combination of valid data update is okay for item

  Scenario: Changing data in any possible valid way is fine
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update
    Then Despite the fields modified I successfully update the item and see properly sorted updated version of it
