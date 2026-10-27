@ts-implemented
Feature: Deleting the existing sublist of a many lists

  Background:
    Given I am "user@example.com"
    When I create a new list

  Scenario: Deleting a sublist of several lists using the deletion method
    And I create the following number of lists: 3
    And I add the original list as a sublist of all other lists
    Then I successfully delete the sublist via "deletion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created lists
    When I ask for the original lists
    Then I do not see the deleted sublist in the original lists items

  Scenario: Deleting a sublist when at the limit of lists using the deletion method
    And I create the following number of lists: pre-limit
    And I add the original list as a sublist of all other lists
    Then I successfully delete the sublist via "deletion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created lists
    When I ask for the original lists
    Then I do not see the deleted sublist in the original lists items

  Scenario: Deleting several imports of a single sublist within a list using the deletion method
    And I create the following number of lists: 1
    And I add the original list as a sublist of all other lists
    And I ensure the following number of items of the prepared lists: 5
    And I add the original list as a sublist of all other lists
    Then I successfully delete the sublist via "deletion" and see properly sorted deletion result
    When I ask for the original lists
    Then I do not see the deleted sublist in the original lists items

  Scenario: Deleting a sublist of a list using the insertion method
    And I create the following number of lists: 1
    And I add the original list as a sublist of all other lists
    Then I successfully delete the sublist via "insertion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created lists
    When I ask for the original lists
    Then I do not see the deleted sublist in the original lists items
    Then I see the deleted list items recreated in the original lists items the following number of times: 1
    When I ask for the original list
    Then I see the following HTTP status code: 404
    Then I see the following error: "list-not-found"

  Scenario: Deleting a sublist of several lists list using the insertion method
    And I create the following number of lists: 3
    And I add the original list as a sublist of all other lists
    Then I successfully delete the sublist via "insertion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created lists
    When I ask for the original lists
    Then I do not see the deleted sublist in the original lists items
    Then I see the deleted list items recreated in the original lists items the following number of times: 1
    Then I see that the recreated items have unique ids

  Scenario: Deleting a sublist when at the limit of lists using the insertion method
    And I create the following number of lists: pre-limit
    And I add the original list as a sublist of all other lists
    Then I successfully delete the sublist via "insertion" and see properly sorted deletion result
    Then I see the following HTTP status code: 200
    Then I see the deleted list id in the deletion result message
    Then I see the affected lists information consisting of the originally created lists
    When I ask for the original lists
    Then I do not see the deleted sublist in the original lists items
    Then I see the deleted list items recreated in the original lists items the following number of times: 1
    Then I see that the recreated items have unique ids

  Scenario: Deleting several imports of a single sublist within a list using the insertion method
    And I create the following number of lists: 1
    And I add the original list as a sublist of all other lists
    And I ensure the following number of items of the prepared lists: 5
    And I add the original list as a sublist of all other lists
    Then I successfully delete the sublist via "insertion" and see properly sorted deletion result
    When I ask for the original lists
    Then I see the deleted list items recreated in the original lists items the following number of times: 2

  Scenario: Attempting to delete several imports of a single sublist within a list when insertion would overflow items
    And I create the following number of lists: 2
    And I add the original list as a sublist of all other lists
    And I ensure the following number of items of the prepared lists: pre-pre-limit
    And I add the original list as a sublist of all other lists
    And I provide the following deletion method: "insertion"
    Then my attempt to delete the exported list fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "deletion-insertion-would-overflow-items"
    Then I see the affected lists in the error

  Scenario: Deleting a sublist with imported list and items via the insertion
    And I create the following number of lists: 3
    And I add the first list items to the original list
    And I add the second list as a sublist of the original list
    And I add the original list as a sublist of the third list
    Then I successfully delete the sublist via "insertion" and see properly sorted deletion result
    When I ask for the original lists
    Then I see the first list items imported to the third list
    Then I see the second list imported to the third list
