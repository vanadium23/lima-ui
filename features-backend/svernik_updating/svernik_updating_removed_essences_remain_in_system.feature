@ts-implemented
Feature: Removing item or svernik from svernik doesn't lead to their deletion from the system

  The removed from svernik update essences are left in the system and are available for consequent referencing.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    And I provide several other correct items

  Scenario: Seeing the removed items in the system after their deletion from svernik
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I use the already existing items as the base
    And I remove some of the existing items
    Then Despite the items removed I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then I expect the removed items to still be in the system

  Scenario: Seeing the removed svernik in the system after it's deletion from svernik
    And I provide a link to available svernik
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I use the already existing items as the base
    And I remove linked svernik
    Then Despite the items removed I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then I expect the removed svernik to still be in the system
