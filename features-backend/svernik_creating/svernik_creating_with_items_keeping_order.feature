@ts-implemented
Feature: Creating a svernik with items keeping their order

  Items appear in svernik the way they are passed.

  Scenario: Creating a svernik with several items will keep the order of the originally passed data
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    Then Items are in the same order they are passed
