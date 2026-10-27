@ts-implemented
Feature: Updating a svernik with items preserve the structure of items provided

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    # It's done twice here to have more items.
    And I provide several correct items
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update

  Scenario: Not seeing the original items after their replacement
    And I don't use the already existing items as the base
    And I provide several other correct items
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then I expect not to see the original items

  Scenario: Seeing less items when throwing out some of the original ones
    And I use the already existing items as the base
    And I remove some of the existing items
    Then Despite the items removed I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then I expect not to see the removed items

  Scenario: Seeing old items after adding the new ones
    And I use the already existing items as the base
    And I provide several other correct items
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then I see both old and new items
