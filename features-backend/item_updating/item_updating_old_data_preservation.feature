@ts-implemented
Feature: Old user-provided data stays intact if not modified on item update

  Scenario: No matter what user-provided data is changed in the item, other user-provided data remains the same
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update
    Then Despite the fields modified I successfully update the item and see properly sorted updated version of it
    Then I see the not modified fields remain the same
