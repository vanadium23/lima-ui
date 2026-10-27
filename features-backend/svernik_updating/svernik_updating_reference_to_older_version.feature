@ts-implemented
Feature: Updated svernik contains the link to its older version

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I want to do essence update
    And I provide a reason for latest update
    And I provide several correct items
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the following HTTP status code: 200

  Scenario: Seeing svernik's older version id on update
    Then Updated svernik contains the link to its older version
