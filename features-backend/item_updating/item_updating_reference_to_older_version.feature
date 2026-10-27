@ts-implemented
Feature: Updated item contains the link to its older version

  Scenario: Seeing item's older version id on update
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide an item with correct content
    Then I successfully create a properly sorted svernik
    Then The last item is the required one
    When I want to do essence update
    And I provide an updated content
    Then I successfully update the item and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Updated item contains the link to its older version
