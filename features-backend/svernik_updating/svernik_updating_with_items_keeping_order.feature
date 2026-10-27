@ts-implemented
Feature: Updating a svernik with items keeping their order

  Updated svernik keeps items in the order they were passed during the update.

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update

  Scenario: Updating a svernik with several items will keep the order of the originally passed data
    And I use the already existing items as the base
    And I provide several correct items
    Then Despite the items' order I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200
    Then Items in all updates are in the same order they are passed
