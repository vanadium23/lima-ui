@ts-implemented
Feature: Deleting the existing sublist of a single list

  Background:
    Given I am "user@example.com"
    When I want to create a new svernik
    And I provide a name
    And I provide a purpose
    And I provide links to several available sverniks
    Then I successfully create a properly sorted svernik
    When I prepare created svernik for consequent actions
    When I want to create another svernik
    And I provide another name
    And I provide another purpose
    And I provide several correct items
    Then I successfully create another properly sorted svernik
    When I want to do essence update
    When I add the created list as a link to the previously created one
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    Then the last list is the required one

  Scenario Outline: Attempting to delete a sublist without providing the deletion method
    But I provide the following deletion method: <deletion method>
    Then my attempt to delete the exported list fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>

    Examples:
      | deletion method     | error message                               |
      | absent              | "deletion-method-missing-for-exported-list" |
      | ""                  | "deletion-method-empty-for-exported-list"   |
      | null                | "deletion-method-empty-for-exported-list"   |
      | "some other string" | "deletion-method-incorrect"                   |
      | 123                 | "deletion-method-incorrect"                   |
      | {}                  | "deletion-method-incorrect"                   |
      | []                  | "deletion-method-incorrect"                   |
      | false               | "deletion-method-incorrect"                   |
      | true                | "deletion-method-incorrect"                   |

  Scenario: Deleting the sublist of the only one list
    Then I successfully delete the sublist via "deletion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created list
    When I ask for the original list
    Then I see the following HTTP status code: 404
    Then I see the following error: "list-not-found"
    When I ask for the original list with deleted sublist
    Then I expect not to see the deleted sublist in the original list items
