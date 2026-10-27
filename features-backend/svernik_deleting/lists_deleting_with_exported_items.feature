@ts-implemented
Feature: Deleting a list with exported items

  Background:
    Given I am "user@example.com"
    When I create a new list

  Scenario: Deleting a list with exported items using the deletion method
    And I create the following number of lists: 3
    And I add items from the original list to other lists
    Then I successfully delete the list with exported items via "deletion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created lists
    When I ask for the original lists
    Then I do not see the deleted list items in the original lists items

  Scenario: Deleting a list with exported items when at the limit of lists using the deletion method
    And I create the following number of lists: pre-limit
    And I add items from the original list to other lists
    Then I successfully delete the list with exported items via "deletion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created lists
    When I ask for the original lists
    Then I do not see the deleted list items in the original lists items

  Scenario: Deleting a list that is both exported as a sublist and has exported items using the deletion method
    And I create the following number of lists: 3
    And I add items from the original list to other lists
    And I add the original list as a sublist of all other lists
    Then I successfully delete the list with exported items via "deletion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created lists
    When I ask for the original lists
    Then I do not see the deleted list items in the original lists items
    Then I do not see the deleted sublist in the original lists items

  Scenario Outline: Attempting to delete a list with exported items without providing the deletion method
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    But I provide the following deletion method: <deletion method>
    Then my attempt to delete the exported list fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>

    Examples:
      | deletion method     | error message                                            |
      | absent              | "deletion-method-missing-for-list-with-exported-items"   |
      | ""                  | "deletion-method-empty-for-list-with-exported-items"     |
      | null                | "deletion-method-empty-for-list-with-exported-items"     |
      | "some other string" | "deletion-method-incorrect-for-list-with-exported-items" |
      | 123                 | "deletion-method-incorrect-for-list-with-exported-items" |
      | {}                  | "deletion-method-incorrect-for-list-with-exported-items" |
      | []                  | "deletion-method-incorrect-for-list-with-exported-items" |
      | false               | "deletion-method-incorrect-for-list-with-exported-items" |
      | true                | "deletion-method-incorrect-for-list-with-exported-items" |

  Scenario: Deleting a list with exported items using the insertion method
    And I create the following number of lists: 3
    And I add items from the original list to other lists
    Then I successfully delete the list with exported items via "insertion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created lists
    When I ask for the original lists
    Then I do not see the deleted list items in the original lists items
    Then I see the deleted list items recreated in the original lists items the following number of times: 1
    Then I see that the recreated items have unique ids

  Scenario: Deleting several imports of items from a single list within another list using the insertion method
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    And I ensure the following number of items of the prepared lists: 5
    And I add items from the original list to other lists
    Then I successfully delete the list with exported items via "insertion" and see properly sorted deletion result
    When I ask for the original lists
    Then I see the deleted list items recreated in the original lists items the following number of times: 2

  Scenario: Deleting a list that is both exported as a sublist and has exported items using the insertion method
    And I create the following number of lists: 3
    And I add items from the original list to other lists
    And I add the original list as a sublist of all other lists
    Then I successfully delete the list with exported items via "insertion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created lists
    When I ask for the original lists
    Then I do not see the deleted list items in the original lists items
    Then I do not see the deleted sublist in the original lists items
    Then I see the deleted list items recreated in the original lists items the following number of times: 2
