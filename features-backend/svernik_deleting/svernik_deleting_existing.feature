@ts-implemented
Feature: Deleting the existing svernik

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose

  Scenario: Deletion result is provided after svernik's deletion
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I prepare created svernik for consequent actions
    Then I successfully delete the list and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the empty list of the affected lists
    When I ask for the original list
    Then I see the following HTTP status code: 404
    Then I see the following error: "list-not-found"

  Scenario: Seeing sublists in the system after list deletion
    And I provide a link to available svernik
    And I provide links to several available sverniks
    Then I successfully create a properly sorted svernik
    When I prepare created svernik for consequent actions
    Then I successfully delete the list and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I expect subsverniks from the deleted svernik to still be in the system

  Scenario Outline: Deletion of a list ignores deletion method
    And I provide several correct items
    Then I successfully create a properly sorted svernik
    When I prepare created svernik for consequent actions
    And I provide the following deletion method: <deletion method>
    Then I successfully delete the list and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the empty list of the affected lists

    Examples:
      | deletion method     |
      | "deletion"          |
      | "insertion"         |
      | ""                  |
      | null                |
      | "some other string" |
      | 123                 |
      | {}                  |
      | []                  |
      | false               |
      | true                |
